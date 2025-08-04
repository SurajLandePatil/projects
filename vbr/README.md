# 🚗 Vehicle Breakdown Assistance (VBA)

A robust web platform for instant vehicle breakdown help: users can request roadside mechanics, track service status, and get WhatsApp updates in real time!

---

## ✨ Features

- **User Dashboard:** Book service with location, track bookings, rate mechanics, see live stats.
- **Mechanic Dashboard:** Accept/reject/cancel bookings, see real-time notifications, manage service status.
- **Admin Panel:** Approve mechanics, view users, manage reports.
- **Automated WhatsApp Notifications:** Mechanics are instantly notified via WhatsApp (powered by Twilio) when a user makes a booking.
- **Interactive Map:** View/search location via Leaflet integration.
- **Modern UI:** Responsive design with Angular Material.
- **Robust backend:** Spring Boot REST API & MySQL.

---

## 🛠️ Tech Stack

- [Angular](https://angular.io/) (frontend)
- [Spring Boot](https://spring.io/projects/spring-boot) (backend)
- [MySQL](https://www.mysql.com/) (database)
- [Twilio API for WhatsApp](https://www.twilio.com/whatsapp) (notifications)
- [Leaflet.js](https://leafletjs.com/) (maps)
- [Angular Material](https://material.angular.io/) (UI components)

---

change the twilio sid and token


## 💬 How WhatsApp Notifications Work

- When a user books assistance, your backend sends a WhatsApp message to the assigned mechanic using the Twilio API.
- Details included: user name, location, Google Maps link, and problem description.
- See [Twilio WhatsApp docs](https://www.twilio.com/docs/whatsapp) for more info.



## 📝 License

This project is licensed under the MIT License.

---

## ⭐ Credits

- [Twilio](https://www.twilio.com/)
- [Angular](https://angular.io/)
- [Spring Boot](https://spring.io/)

---

**Built with ❤️ by Suraj and the open source community.**
