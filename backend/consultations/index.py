import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    """API для управления записями на консультации"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        
        if method == 'POST':
            result = create_consultation(conn, event)
        elif method == 'GET':
            result = get_consultations(conn, event)
        else:
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
        
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def create_consultation(conn, event: dict) -> dict:
    body = json.loads(event.get('body', '{}'))
    headers = event.get('headers', {})
    
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {'error': 'User ID required'}
    
    consultation_date = body.get('date')
    consultation_time = body.get('time')
    description = body.get('description', '')
    
    if not consultation_date or not consultation_time:
        return {'error': 'Date and time required'}
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "SELECT id FROM users WHERE id = %s AND is_verified = TRUE",
        (user_id,)
    )
    
    user = cursor.fetchone()
    if not user:
        cursor.close()
        return {'error': 'User not verified'}
    
    cursor.execute(
        """
        INSERT INTO consultations (user_id, consultation_date, consultation_time, description)
        VALUES (%s, %s, %s, %s)
        RETURNING id, consultation_date, consultation_time, description, status, created_at
        """,
        (user_id, consultation_date, consultation_time, description)
    )
    
    consultation = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {
        'success': True,
        'consultation': dict(consultation)
    }

def get_consultations(conn, event: dict) -> dict:
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {'error': 'User ID required'}
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        """
        SELECT id, consultation_date, consultation_time, description, status, created_at
        FROM consultations
        WHERE user_id = %s
        ORDER BY consultation_date DESC, consultation_time DESC
        """,
        (user_id,)
    )
    
    consultations = cursor.fetchall()
    cursor.close()
    
    return {
        'consultations': [dict(c) for c in consultations]
    }
