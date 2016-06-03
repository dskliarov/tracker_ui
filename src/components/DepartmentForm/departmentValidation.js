import {createValidator, required, maxLength} from 'utils/validation';
const departmentValidation = createValidator({
  name: [required, maxLength(10)]
});
export default departmentValidation;
