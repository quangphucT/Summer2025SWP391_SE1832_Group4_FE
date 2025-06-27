
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



// doctor 
export * as createAccountDoctorFollowingType from './doctorApi/createAccountDoctorFollowingTypeApi'

// create result test after test
export * as createResultAfterTest from './doctorTestingAPI/createResultAfterTestApi'

// update appointment status completed
export * as updateAppointmentStatusCompleted from './appointmentAPI/updateAppointmentCompletedApi'

// get result test HIV
export * as getResultTestHIV from './Results/getResultTestHIVAPI'
