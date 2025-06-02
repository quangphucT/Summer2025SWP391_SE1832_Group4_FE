import Carousel from '../../components/carousel'
import './index.scss'
import virusimage from "../../assets/images/virus.png";
import imagedrug from "../../assets/images/drug.jpg";
import { User2, Users2, BookOpenCheck, Hospital } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const bookingAppointmentPath = "/booking-appointment";
  return (
    <div className="h-[2000px]">
      <Carousel />
      {/* Main services  */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto p-6">
          {/* Tiêu đề dịch vụ chính */}
          <div className="flex justify-center mb-8">
            <div className="px-8 py-3 rounded-full border-2 border-cyan-500 bg-cyan-50 text-cyan-700 text-xl font-bold shadow-sm">
              MAIN SERVICES AT HIV TREATMENT
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Cột 1 - Các dịch vụ chính */}
            <div className="space-y-6">
              {/* HIV Treatment */}
              <div className="bg-white rounded-lg p-6 shadow-sm h-48 flex flex-col justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={virusimage} alt="virus" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      HIV Treatment
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Consultation and support to access the latest HIV treatment regimens licensed by the Ministry of Health.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                    onClick={() => navigate(bookingAppointmentPath)}
                  >
                    REGISTER <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </div>

              {/* CD4 Count Testing */}
              <div className="bg-white rounded-lg p-6 shadow-sm h-48 flex flex-col justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={virusimage} alt="virus" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      CD4 Count Testing
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      CD4 testing is essential for evaluating the immune system in people living with HIV. It helps healthcare providers determine the right treatment plan and monitor the effectiveness of ARV therapy.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                    onClick={() => navigate(bookingAppointmentPath)}
                  >
                    REGISTER <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </div>

              {/* ARV Treatment Regimen */}
              <div className="bg-white rounded-lg p-6 shadow-sm h-48 flex flex-col justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={virusimage} alt="virus" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ARV Treatment Regimen
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Antiretroviral therapy (ARV) helps control the progression of HIV, improves quality of life,
                      and extends lifespan for people living with HIV. Consistent treatment can reduce the viral load to undetectable levels.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 mt-auto">
                  <button
                    className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                    onClick={() => navigate(bookingAppointmentPath)}
                  >
                    REGISTER <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cột 2-Các dịch vụ khác */}
            <div className="space-y-6">
              {/* HIV Screening Test */}
              <div className="bg-white rounded-lg p-6 shadow-sm h-48 flex flex-col justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={virusimage} alt="virus" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      HIV Screening Test
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Fast, accurate, and confidential HIV screening test helps clients early detect and effectively manage HIV status.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                    onClick={() => navigate(bookingAppointmentPath)}
                  >
                    REGISTER <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </div>

              {/* STI Testing */}
              <div className="bg-white rounded-lg p-6 shadow-sm h-48 flex flex-col justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={virusimage} alt="virus" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sexually Transmitted Infections (STIs) Testing
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Comprehensive testing for sexually transmitted infections (STIs) to ensure early detection and timely treatment, protecting your sexual health.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                    onClick={() => navigate(bookingAppointmentPath)}
                  >
                    REGISTER <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </div>

              {/* General Cancer Screening */}
              <div className="bg-white rounded-lg p-6 shadow-sm h-48 flex flex-col justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <img src={virusimage} alt="virus" className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      General Cancer Screening
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Cancer screening involves performing tests on healthy people who have no symptoms of the disease.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 mt-auto">
                  <button
                    className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                    onClick={() => navigate(bookingAppointmentPath)}
                  >
                    REGISTER <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cột 3 - Hình ảnh và thông tin phòng khám */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-0 shadow-sm overflow-hidden">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <img src={imagedrug} alt="consultation" className="w-full h-full object-contain" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cyan-600 mb-4">HIV - Treatment</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    HIV Treatment has become a multidisciplinary clinic providing comprehensive and professional healthcare, especially in HIV prevention and treatment and sexually transmitted diseases (STDs).
                  </p>
                  <p className="text-gray-600 text-sm">
                    HIV Treatment aims to be a leading multidisciplinary clinic in professional quality and in applying advanced technology in Vietnam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Four stats */}
      <div className="bg-cyan-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* founded */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">2017</span>
                <span className="bg-green-400/80 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  <Hospital size={28} />
                </span>
              </div>
              <span className="mt-2 text-lg text-center">HIV Treatment Clinic established</span>
            </div>
            {/* doctors */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">10,000+</span>
                <span className="bg-sky-400/80 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  <User2 size={28} />
                </span>
              </div>
              <span className="mt-2 text-lg text-center">Highly qualified doctors</span>
            </div>
            {/* customers */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">20,000+</span>
                <span className="bg-pink-400/80 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  <Users2 size={28} />
                </span>
              </div>
              <span className="mt-2 text-lg text-center">Patients served</span>
            </div>
            {/* knowledge provided */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">100,000+</span>
                <span className="bg-yellow-400/80 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  <BookOpenCheck size={28} />
                </span>
              </div>
              <span className="mt-2 text-lg text-center">People educated</span>
            </div>
          </div>
          {/* title & description */}
          <div className="text-center mb-6">
            <span className="block font-bold text-2xl md:text-3xl mb-2">MULTIDISCIPLINARY CLINIC</span>
            <span className="block font-extrabold text-4xl md:text-5xl text-cyan-800 mb-2">HIV TREATMENT</span>
            <div className="h-1 w-24 bg-cyan-500 mx-auto rounded mb-4"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center text-lg mb-2">
            HIV Treatment Clinic is a sustainable community healthcare model developed through the collaboration and investment of community-based organizations (CBOs), such as G3VN, AloBoy, Colors of Life, Smile, and Overcome.
          </div>
          <div className="max-w-5xl mx-auto text-center text-lg">
            HIV Treatment Clinic is a renowned destination for the LGBT community, including gay, bisexual, and transgender individuals. HIV Treatment is always ready to welcome clients with friendliness, responsibility, dedication, and the utmost empathy.
          </div>
        </div>
      </div>
    </div>
  );

}

export default HomePage
