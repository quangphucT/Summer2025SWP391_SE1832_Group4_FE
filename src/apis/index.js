
export * as registerAPI from "./authenticationApi/registerApi";
export * as setupPassworApi from "./authenticationApi/setupPasswordApi"
export * as forgotPasswordApi from "./authenticationApi/forgotPasswordApi"
export * as resetPasswordApi from "./authenticationApi/resetPasswordApi"
export * as updateProfileApi from "./authenticationApi/updateProfileApi"
export * as changePasswordApi from "./authenticationApi/changePasswordApi"
export * as getAllDoctorsApi from "./doctorApi/getAllDoctorsApi"
export * as getAllRolesApi from "./doctorApi/getAllRoleApi"
export * as createAppointmentApi from "./appointmentAPI/createAppointmentApi"

export * as getAllAppointmentsApi from './appointmentAPI/getAllAppointmentsApi'
export * as confirmAppointmentApi from './appointmentAPI/confirmAppointmentApi'


export * as cancelAppointmentApi from './appointmentAPI/cancelAppointmentApi'

export * as getAllAppointmentsTodayApi from './appointmentAPI/getAllAppointmentsTodayApi'
export * as getAvailableSchedulesDoctors from './doctorApi/getAvailableSchedulesDoctorsApi'
export * as searchAppointmentByPhone from './appointmentAPI/searchAppointmentByPhoneApi'
export * as checkInAppointment from './appointmentAPI/checkInAppointmentApi'

export * as createAppointmentTest from './appointmentAPI/createAppointmentApi'

export * as getAvailableSchedulesDoctorTesting from './doctorApi/getAvailableSchedulesDoctorTestingApi'



// Auth 

export * as createAccountAutoSetPasswordApi from './authenticationApi/createAccountAutoSetPasswordApi'


// filter
     // consultant
export * as getAllAppointmentsConsultant from './appointmentAPI/getAppointmentConsultantApi'
    // testing
export * as getAllAppointmentsTesting from './appointmentAPI/getAllAppointmentTestingApi'


  // get all available schedules doctor therapy
export * as getAvailableSchedulesDoctorsTherapy from './doctorApi/getAllAvailableSchedulesDoctorTherapyApi'


// doctor 
export * as createAccountDoctorFollowingType from './doctorApi/createAccountDoctorFollowingTypeApi'

// create result test after test
export * as createResultAfterTest from './doctorTestingAPI/createResultAfterTestApi'

// update appointment status completed
export * as updateAppointmentStatusCompleted from './appointmentAPI/updateAppointmentCompletedApi'

// get result test HIV
export * as getResultTestHIV from './Results/getResultTestHIVAPI'

// find medical record by patient id
export * as findMedicalRecordByPatientId from './medicalRecord/findMedicalRecordByPatienIdApi'
// get test result by patient id
export * as getTestResultByPatientId from './Results/getTestResultByPatientIdAPI'

// create medical record from test result
export * as createMedicalRecord from './medicalRecord/createMedicalRecordApi'
// get medical record by patient email
export * as getMedicalRecordByPatientEmail from './medicalRecord/getMedicalRecordByPatientEmailApi'
// create therapy for patient
export * as createTherapyForPatient from './doctorApi/createTherapyForPatientApi' 
// add test result to medical record
export * as addTestResultToMedicalRecord from './medicalRecord/addTestResultToMedicalRecordApi'