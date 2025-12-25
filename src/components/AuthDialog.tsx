import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (userId: string) => void;
}

export default function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentCode, setSentCode] = useState("");

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleSendCode = async () => {
    setLoading(true);
    setError("");
    
    if (authMethod === "email" && !isValidEmail(email)) {
      setError("Введите корректный email адрес");
      setLoading(false);
      return;
    }
    
    if (authMethod === "phone" && !isValidPhone(phone)) {
      setError("Введите корректный номер телефона");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("https://functions.poehali.dev/fa068b12-cf81-465a-aec3-348b02b97852", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_code",
          email: authMethod === "email" ? email : undefined,
          phone: authMethod === "phone" ? phone : undefined
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setSentCode(data.code);
        setStep("verify");
      }
    } catch (err) {
      setError("Ошибка отправки кода");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://functions.poehali.dev/fa068b12-cf81-465a-aec3-348b02b97852", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_code",
          email: authMethod === "email" ? email : undefined,
          phone: authMethod === "phone" ? phone : undefined,
          code
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        onSuccess(data.user_id);
        onOpenChange(false);
        resetForm();
      }
    } catch (err) {
      setError("Ошибка проверки кода");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("input");
    setEmail("");
    setPhone("");
    setCode("");
    setError("");
    setSentCode("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Авторизация</DialogTitle>
          <DialogDescription>
            {step === "input" 
              ? "Введите email или телефон для получения кода" 
              : "Введите код подтверждения"}
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="space-y-4">
            <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "email" | "phone")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Телефон</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="text-sm text-destructive flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handleSendCode}
              disabled={loading || (authMethod === "email" ? !email || !isValidEmail(email) : !phone || !isValidPhone(phone))}
            >
              {loading ? "Отправка..." : "Получить код"}
              <Icon name="Send" className="ml-2" size={16} />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Код отправлен на {authMethod === "email" ? email : phone}
              </p>
              <p className="text-xs text-muted-foreground">
                Для демонстрации: <span className="font-mono font-bold">{sentCode}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep("input")}
              >
                Назад
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
              >
                {loading ? "Проверка..." : "Подтвердить"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}