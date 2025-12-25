import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onNeedAuth: () => void;
}

export default function ConsultationDialog({ open, onOpenChange, userId, onNeedAuth }: ConsultationDialogProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!userId) {
      onOpenChange(false);
      onNeedAuth();
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://functions.poehali.dev/90f085fc-8cff-4b93-807b-81e2bde94b6d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId
        },
        body: JSON.stringify({
          date,
          time,
          description
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          resetForm();
        }, 2000);
      }
    } catch (err) {
      setError("Ошибка создания записи");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate("");
    setTime("");
    setDescription("");
    setError("");
    setSuccess(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Записаться на консультацию</DialogTitle>
          <DialogDescription>
            Заполните форму и мы свяжемся с вами для подтверждения времени
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Check" size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Запись создана!</h3>
              <p className="text-sm text-muted-foreground">
                Мы свяжемся с вами для подтверждения консультации
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  type="date"
                  min={getTodayDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Время</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание задачи</Label>
              <Textarea
                id="description"
                placeholder="Расскажите о вашей ситуации и целях консультации..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={loading || !date || !time}
            >
              {loading ? "Отправка..." : "Записаться"}
              <Icon name="Calendar" className="ml-2" size={16} />
            </Button>

            {!userId && (
              <p className="text-xs text-center text-muted-foreground">
                Для записи необходима авторизация
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
