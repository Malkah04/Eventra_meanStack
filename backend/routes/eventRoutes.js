import { Router } from "express";
import * as eventController from "../controllers/eventController.js"; 
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/event.validation.js"; 
import { roleEnum } from "../DB/models/user.model.js"; // لو هتستعملي رولز زي Admin

const router = Router();

// إنشاء حدث جديد (Admin فقط مثلاً)
router.post(
  "/",
  authentication(),
  authorization([roleEnum.admin]), 
  validation(validators.createEvent),
  eventController.createEvent
);

// الحصول على كل الأحداث (عام)
router.get(
  "/",
  validation(validators.getEvents), 
  eventController.getEvents
);

// الحصول على حدث معين بالـ id
router.get(
  "/:eventId",
  validation(validators.getEventById),
  eventController.getEventById
);

// تحديث حدث (Admin فقط مثلاً)
router.patch(
  "/:eventId",
  authentication(),
  authorization([roleEnum.admin]), 
  validation(validators.updateEvent),
  eventController.updateEvent
);

// حذف حدث (Admin فقط مثلاً)
router.delete(
  "/:eventId",
  authentication(),
  authorization([roleEnum.admin]), 
  validation(validators.deleteEvent),
  eventController.deleteEvent
);

export default router;