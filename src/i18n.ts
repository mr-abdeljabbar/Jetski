import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "activities": "Activities",
      "about": "About",
      "contact": "Contact",
      "book_now": "Book Now",
      "hero_title": "Experience the Best Water Activities in Taghazout",
      "hero_subtitle": "Jet ski, boat trips, and more. Unforgettable moments await.",
      "featured_activities": "Featured Activities",
      "why_choose_us": "Why Choose Us",
      "customer_reviews": "Customer Reviews",
      "duration": "Duration",
      "price": "Price",
      "persons": "Persons",
      "date": "Date",
      "time": "Time",
      "full_name": "Full Name",
      "whatsapp_number": "WhatsApp Number",
      "submit_booking": "Submit Booking",
      "pending": "Pending",
      "confirmed": "Confirmed",
      "completed": "Completed",
      "cancelled": "Cancelled"
    }
  },
  fr: {
    translation: {
      "home": "Accueil",
      "activities": "Activités",
      "about": "À propos",
      "contact": "Contact",
      "book_now": "Réserver",
      "hero_title": "Vivez les meilleures activités nautiques à Taghazout",
      "hero_subtitle": "Jet ski, excursions en bateau et plus. Des moments inoubliables vous attendent.",
      "featured_activities": "Activités en vedette",
      "why_choose_us": "Pourquoi nous choisir",
      "customer_reviews": "Avis clients",
      "duration": "Durée",
      "price": "Prix",
      "persons": "Personnes",
      "date": "Date",
      "time": "Heure",
      "full_name": "Nom complet",
      "whatsapp_number": "Numéro WhatsApp",
      "submit_booking": "Soumettre la réservation",
      "pending": "En attente",
      "confirmed": "Confirmé",
      "completed": "Terminé",
      "cancelled": "Annulé"
    }
  },
  ar: {
    translation: {
      "home": "الرئيسية",
      "activities": "الأنشطة",
      "about": "معلومات عنا",
      "contact": "اتصل بنا",
      "book_now": "احجز الآن",
      "hero_title": "استمتع بأفضل الأنشطة المائية في تغازوت",
      "hero_subtitle": "جيت سكي، رحلات قوارب والمزيد. لحظات لا تنسى في انتظارك.",
      "featured_activities": "الأنشطة المميزة",
      "why_choose_us": "لماذا تختارنا",
      "customer_reviews": "آراء العملاء",
      "duration": "المدة",
      "price": "السعر",
      "persons": "الأشخاص",
      "date": "التاريخ",
      "time": "الوقت",
      "full_name": "الاسم الكامل",
      "whatsapp_number": "رقم الواتساب",
      "submit_booking": "تأكيد الحجز",
      "pending": "قيد الانتظار",
      "confirmed": "مؤكد",
      "completed": "مكتمل",
      "cancelled": "ملغى"
    }
  },
  es: {
    translation: {
      "home": "Inicio",
      "activities": "Actividades",
      "about": "Acerca de",
      "contact": "Contacto",
      "book_now": "Reservar Ahora",
      "hero_title": "Experimenta las mejores actividades acuáticas en Taghazout",
      "hero_subtitle": "Motos de agua, paseos en barco y más. Momentos inolvidables te esperan.",
      "featured_activities": "Actividades Destacadas",
      "why_choose_us": "Por qué elegirnos",
      "customer_reviews": "Opiniones de clientes",
      "duration": "Duración",
      "price": "Precio",
      "persons": "Personas",
      "date": "Fecha",
      "time": "Hora",
      "full_name": "Nombre completo",
      "whatsapp_number": "Número de WhatsApp",
      "submit_booking": "Enviar reserva",
      "pending": "Pendiente",
      "confirmed": "Confirmado",
      "completed": "Completado",
      "cancelled": "Cancelado"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
