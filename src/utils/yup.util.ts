import * as yup from 'yup';

export class YupUtil {
  private static userName = yup.string().matches(/^[A-Za-zА-Яа-я ]+$/);
  private static email = yup.string().required('fieldRequired').email('fieldInvalid');
  private static price = yup.string()
    .matches(/^\d*(\.\d{2})?$/, 'invalidPrice')
    .required('fieldRequired');
  private static password = yup
    .string()
    .required('fieldRequired')
    .min(6, 'passwordIsInvalid');
  private static passwordRepeat = yup
    .string()
    .required('fieldRequired')
    .oneOf([yup.ref('password')], 'passwordMustMatch')

  static get RegistrationSchema() {
    return yup.object().shape({
      name: YupUtil.userName,
      phone: yup.string(),
      email: YupUtil.email,
      password: YupUtil.password,
      passwordRepeat: YupUtil.passwordRepeat,
    });
  }

  static get SignInSchema() {
    return yup.object().shape({
      email: YupUtil.email,
      password: YupUtil.password,
    });
  }

  static get RequestCallSchema() {
    return yup.object().shape({
      name: YupUtil.userName,
      phone: yup.string().required('fieldRequired'),
      comment: yup.string()
    });
  }

  static get CheckoutFormSchema() {
    return yup.object().shape({
      name: YupUtil.userName,
      phone: yup.string().required('fieldRequired'),
      comment: yup.string(),
      deliveryAddress: yup.string().required('fieldRequired'),
      email: YupUtil.email,
    });
  }

  static get ProfileMainInfoSchema() {
    return yup.object().shape({
      name: YupUtil.userName,
      phone: yup.string(),
      comment: yup.string(),
      deliveryAddress: yup.string(),
      email: YupUtil.email,
    });
  }

  static get GeneralEditorFormSchema() {
    return yup.object().shape({
      phone: yup.string().required('fieldRequired'),
      workingHours: yup.string().required('fieldRequired'),
      currency: yup.string().required('fieldRequired'),
      shopDescription: yup.string().required('fieldRequired'),
      deliveryDescription: yup.string().required('fieldRequired'),
      shopRegistrationDescription: yup.string().required('fieldRequired'),
    });
  }

  static get ProductEditorFormSchema() {
    return yup.object().shape({
      price: YupUtil.price,
      title: yup.string().required('fieldRequired'),
      description: yup.string().required('fieldRequired'),
      categoryId: yup.string().required('fieldRequired'),
      vendorCode: yup.string().required('fieldRequired'),
      images: yup.array().required('fieldRequired'),
      labels: yup.array()
    });
  }

  static get CategoryEditorFormSchema() {
    return yup.object().shape({
      imageUrl: yup.string().required('fieldRequired'),
      title: yup.string().required('fieldRequired'),
      subcategories: yup.array()
    });
  }
}