import Carousel from '../../components/carousel'
import './index.scss'
import virusimage from "../../assets/images/virus.png";
import imagedrug from "../../assets/images/drug.jpg";
import { User2, Users2, BookOpenCheck, Hospital, Star, Shield, Clock, Award, CheckCircle, Phone, MapPin, Mail, ChevronDown, ChevronUp, AlertTriangle, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const bookingAppointmentPath = "/schedule-consultation";
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How confidential is my information?",
      answer: "Your privacy is our top priority. All patient information is kept strictly confidential and protected by medical privacy laws. We never share your information without your explicit consent."
    },
    {
      id: 2,
      question: "What should I expect during my first visit?",
      answer: "Your first visit will include a comprehensive consultation, medical history review, and necessary tests. The process typically takes 1-2 hours. Our staff will guide you through every step."
    },
    {
      id: 3,
      question: "How long does it take to get test results?",
      answer: "Most test results are available within 24-48 hours. For specialized tests, results may take 3-5 business days. We will contact you as soon as results are ready."
    },
    {
      id: 4,
      question: "Do you accept insurance?",
      answer: "We work with most major insurance providers. Please contact us to verify your coverage. We also offer flexible payment plans for self-pay patients."
    }
  ];

  const doctors = [
    {
      name: "Dr. Nguyen Van An",
      specialty: "HIV Specialist",
      experience: "15+ years",
      image: "https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Dr.+An"
    },
    {
      name: "Dr. Tran Thi Binh",
      specialty: "Infectious Disease",
      experience: "12+ years", 
      image: "https://via.placeholder.com/150x150/059669/FFFFFF?text=Dr.+Binh"
    },
    {
      name: "Dr. Le Van Cuong",
      specialty: "Immunology",
      experience: "18+ years",
      image: "https://via.placeholder.com/150x150/DC2626/FFFFFF?text=Dr.+Cuong"
    }
  ];

  const news = [
    {
      title: "New HIV Treatment Guidelines Released",
      date: "Dec 15, 2024",
      excerpt: "Latest WHO guidelines for HIV treatment and prevention have been updated with new recommendations...",
      image: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=News+1"
    },
    {
      title: "Breakthrough in Early Detection Methods",
      date: "Dec 10, 2024", 
      excerpt: "New testing methods show 99.9% accuracy in early HIV detection, improving treatment outcomes...",
      image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=News+2"
    },
    {
      title: "Community Health Awareness Campaign",
      date: "Dec 5, 2024",
      excerpt: "Our clinic launches comprehensive health education program reaching over 10,000 people...",
      image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=News+3"
    }
  ];

  return (
    <div className="h-auto">
      <Carousel />
      {/* Hero Section with Strong CTA */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Professional, confidential, and compassionate HIV treatment and prevention services. 
            Join thousands of satisfied patients who trust us with their health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(bookingAppointmentPath)}
              className="bg-white text-cyan-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Book Consultation Now
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-cyan-700 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">100% Confidential</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Licensed by MOH</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">ISO Certified</span>
            </div>
          </div>
        </div>
      </div>
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
      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HIV Treatment Clinic?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the highest quality care with a focus on your privacy, comfort, and well-being
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Medical Team</h3>
              <p className="text-gray-600">
                Our team consists of highly qualified doctors with over 10+ years of experience in HIV treatment and prevention.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Privacy</h3>
              <p className="text-gray-600">
                Your privacy is our top priority. All consultations and test results are kept strictly confidential.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Latest Technology</h3>
              <p className="text-gray-600">
                We use the most advanced medical equipment and treatment protocols approved by the Ministry of Health.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from patients who have trusted us with their health
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The staff here is incredibly professional and caring. They made me feel comfortable throughout my entire treatment journey."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Nguyen Van A</p>
                  <p className="text-sm text-gray-500">Patient since 2020</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Fast, accurate testing and professional consultation. The doctors here really know their field and care about patients."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Tran Thi B</p>
                  <p className="text-sm text-gray-500">Patient since 2021</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Excellent service and complete privacy. I feel safe and supported here. Highly recommend to anyone seeking professional care."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Le Van C</p>
                  <p className="text-sm text-gray-500">Patient since 2019</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="bg-cyan-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don't wait. Early detection and treatment can make all the difference. 
            Contact us today for a confidential consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate(bookingAppointmentPath)}
              className="bg-white text-cyan-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Book Your Consultation
            </button>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-lg">Hotline: 1900-xxxx</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our services
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Profiles Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-lg text-gray-600">
              Experienced specialists dedicated to your health and well-being
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm mb-4">{doctor.experience} experience</p>
                <button 
                  onClick={() => navigate(bookingAppointmentPath)}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Book Consultation
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Health News & Updates
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed with the latest developments in HIV treatment and prevention
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {article.date}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                  <button className="text-cyan-600 font-medium text-sm flex items-center gap-1 hover:underline">
                    Read More <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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
