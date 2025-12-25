import json
import os
import random
import string
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для авторизации пользователей через email или телефон"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        
        if action == 'send_code':
            result = send_verification_code(conn, body)
        elif action == 'verify_code':
            result = verify_code(conn, body)
        else:
            result = {'error': 'Invalid action'}
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def send_verification_code(conn, body: dict) -> dict:
    email = body.get('email')
    phone = body.get('phone')
    
    if not email and not phone:
        return {'error': 'Email or phone required'}
    
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.now() + timedelta(minutes=10)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if email:
        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )
    else:
        cursor.execute(
            "SELECT id FROM users WHERE phone = %s",
            (phone,)
        )
    
    user = cursor.fetchone()
    
    if user:
        cursor.execute(
            "UPDATE users SET verification_code = %s, code_expires_at = %s WHERE id = %s",
            (code, expires_at, user['id'])
        )
    else:
        cursor.execute(
            "INSERT INTO users (email, phone, verification_code, code_expires_at) VALUES (%s, %s, %s, %s) RETURNING id",
            (email, phone, code, expires_at)
        )
        user_id = cursor.fetchone()['id']
    
    conn.commit()
    cursor.close()
    
    return {
        'success': True,
        'message': f'Код отправлен на {email or phone}',
        'code': code
    }

def verify_code(conn, body: dict) -> dict:
    email = body.get('email')
    phone = body.get('phone')
    code = body.get('code')
    
    if not code:
        return {'error': 'Verification code required'}
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if email:
        cursor.execute(
            "SELECT id, verification_code, code_expires_at FROM users WHERE email = %s",
            (email,)
        )
    else:
        cursor.execute(
            "SELECT id, verification_code, code_expires_at FROM users WHERE phone = %s",
            (phone,)
        )
    
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        return {'error': 'User not found'}
    
    if user['verification_code'] != code:
        cursor.close()
        return {'error': 'Invalid code'}
    
    if datetime.now() > user['code_expires_at']:
        cursor.close()
        return {'error': 'Code expired'}
    
    cursor.execute(
        "UPDATE users SET is_verified = TRUE WHERE id = %s",
        (user['id'],)
    )
    conn.commit()
    cursor.close()
    
    return {
        'success': True,
        'user_id': user['id'],
        'message': 'Verification successful'
    }
