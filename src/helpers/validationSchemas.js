import * as Yup from 'yup';

function generateFormSchema(customValidations) {
  const initialValues = {};
  const validationSchema = {};

  Object.entries(customValidations).forEach(([fieldName, validationConfig]) => {
    initialValues[fieldName] = '';

    let fieldSchema = Yup.string();

    if (validationConfig.patterns) {
      validationConfig.patterns.forEach(({ pattern, message }) => {
        fieldSchema = fieldSchema.matches(pattern, message);
      });
    }

    if (validationConfig.required) {
      const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      fieldSchema = fieldSchema.required(`${capitalizedFieldName} is Required!`);
    }

    validationSchema[fieldName] = fieldSchema;
  });
  return { initialValues, validationSchema: Yup.object().shape(validationSchema) };
}

export default generateFormSchema;
