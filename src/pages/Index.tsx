import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

export default function Index() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-heading font-bold">TechVision</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#solutions" className="text-sm hover:text-primary transition-colors">Решения</a>
            <a href="#process" className="text-sm hover:text-primary transition-colors">Процесс</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Отзывы</a>
            <Button size="sm">Связаться</Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                IT-консалтинг нового поколения
              </div>
              <h1 className="text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Трансформируем <span className="text-primary">бизнес</span> через технологии
              </h1>
              <p className="text-lg text-muted-foreground">
                Стратегическое IT-планирование и консалтинг для масштабирования вашего бизнеса. 
                Помогаем инвесторам и B2B-клиентам принимать решения на основе данных.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-base">
                  Начать проект
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  Презентация
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                <div>
                  <div className="text-3xl font-heading font-bold text-primary">150+</div>
                  <div className="text-sm text-muted-foreground">Реализованных проектов</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-primary">$50M+</div>
                  <div className="text-sm text-muted-foreground">Привлечено инвестиций</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Удовлетворённых клиентов</div>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="aspect-square rounded-2xl overflow-hidden border border-primary/20">
                <img 
                  src="https://cdn.poehali.dev/projects/402bd99a-199d-474d-ab71-920e41eb56df/files/b00a45b4-e56e-4507-8cf0-53942f9f031d.jpg" 
                  alt="IT-консалтинг команда" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-heading font-bold">Наши решения</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Комплексный подход к цифровой трансформации вашего бизнеса
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "Target",
                title: "Стратегическое планирование",
                description: "Разработка долгосрочной IT-стратегии, соответствующей бизнес-целям"
              },
              {
                icon: "TrendingUp",
                title: "Масштабирование инфраструктуры",
                description: "Построение гибкой архитектуры для роста без ограничений"
              },
              {
                icon: "Shield",
                title: "Кибербезопасность",
                description: "Защита критически важных данных и соответствие стандартам"
              },
              {
                icon: "Zap",
                title: "Автоматизация процессов",
                description: "Оптимизация операций через внедрение AI и ML решений"
              },
              {
                icon: "Users",
                title: "Управление командой",
                description: "Формирование и развитие высокоэффективных IT-отделов"
              },
              {
                icon: "BarChart",
                title: "Аналитика и метрики",
                description: "Data-driven подход к принятию бизнес-решений"
              }
            ].map((item, index) => (
              <Card key={index} className="hover-scale bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={item.icon as any} className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-heading font-bold">Как мы работаем</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Проверенная методология от анализа до внедрения
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Диагностика",
                description: "Глубокий анализ текущего состояния IT-инфраструктуры и бизнес-процессов"
              },
              {
                step: "02",
                title: "Стратегия",
                description: "Разработка дорожной карты трансформации с чёткими метриками успеха"
              },
              {
                step: "03",
                title: "Реализация",
                description: "Поэтапное внедрение решений с минимальным влиянием на операционную деятельность"
              },
              {
                step: "04",
                title: "Оптимизация",
                description: "Постоянный мониторинг, масштабирование и улучшение результатов"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="space-y-4">
                  <div className="text-6xl font-heading font-bold text-primary/20">{item.step}</div>
                  <h3 className="text-2xl font-heading font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-heading font-bold">Что говорят клиенты</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Реальные результаты от компаний, которые нам доверились
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Александр Петров",
                role: "CEO, FinTech Startup",
                content: "TechVision помогли нам привлечь Series A раунд в $5M благодаря правильной технической стратегии. Инвесторы оценили масштабируемость архитектуры.",
                rating: 5
              },
              {
                name: "Мария Соколова",
                role: "CTO, E-commerce Platform",
                content: "Сократили время загрузки на 70% и увеличили конверсию на 40%. Профессионализм команды на высшем уровне.",
                rating: 5
              },
              {
                name: "Дмитрий Волков",
                role: "Managing Partner, Venture Fund",
                content: "Рекомендуем TechVision всем портфельным компаниям. Их due diligence спас нас от нескольких неудачных инвестиций.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="pt-4 border-t border-border">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-heading font-bold">Готовы к трансформации?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Начните с бесплатной консультации. Обсудим ваши цели и предложим оптимальную стратегию.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="text-base">
                  Записаться на консультацию
                  <Icon name="Calendar" className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  <Icon name="Phone" className="mr-2" size={20} />
                  +7 (495) 123-45-67
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-heading font-bold">TechVision</div>
              <p className="text-sm text-muted-foreground">
                IT-консалтинг и стратегическое планирование для масштабирования бизнеса
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Решения</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Стратегия</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Инфраструктура</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Безопасность</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Кейсы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Карьера</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@techvision.ru</li>
                <li>+7 (495) 123-45-67</li>
                <li>Москва, Сити</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 TechVision. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}