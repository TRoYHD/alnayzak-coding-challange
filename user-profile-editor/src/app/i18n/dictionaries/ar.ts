import { Dictionary } from '../config';

const dictionary: Dictionary = {
  page: {
    title: 'الملف الشخصي',
    subtitle: 'تحديث معلوماتك الشخصية',
  },
  form: {
    name: {
      label: 'الاسم',
      placeholder: 'اسمك',
    },
    email: {
      label: 'البريد الإلكتروني',
      placeholder: 'your.email@example.com',
    },
    bio: {
      label: 'نبذة عنك',
      placeholder: 'أخبرنا عن نفسك...',
      description: 'الحد الأقصى 200 حرف',
    },
    profilePicture: {
      label: 'صورة الملف الشخصي',
      description: 'تحميل صورة للملف الشخصي',
      chooseImage: 'اختر صورة',
      remove: 'إزالة',
    },
    submit: 'حفظ الملف الشخصي',
    submitting: 'جاري الحفظ...',
  },
  validation: {
    name: {
      required: 'الاسم مطلوب',
      minLength: 'يجب أن يحتوي الاسم على حرفين على الأقل',
      maxLength: 'لا يمكن أن يتجاوز الاسم 50 حرفًا',
    },
    email: {
      required: 'البريد الإلكتروني مطلوب',
      invalid: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    },
    bio: {
      maxLength: 'لا يمكن أن تتجاوز النبذة 200 حرف',
    },
    server: {
      error: 'خطأ في تقديم النموذج',
    },
  },
  notifications: {
    success: 'تم تحديث الملف الشخصي بنجاح!',
    error: 'فشل تحديث الملف الشخصي',
  },
};

export default dictionary;