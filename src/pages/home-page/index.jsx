import Carousel from '../../components/carousel'
import './index.scss'
import virusimage from "../../assets/images/virus.png";
import imagedrug from "../../assets/images/drug.jpg";
import { User2, Users2, BookOpenCheck, Hospital, Star, Shield, Clock, Award, CheckCircle, Phone, MapPin, Mail, ChevronDown, ChevronUp, AlertTriangle, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { getDoctorsBySpecialty } from "../../apis/doctorApi/doctorApi";
import DoctorCard from '../../components/DoctorCard';
import { getAllBlogs } from '../../apis/blogsApi';
import { getFeedbacks } from '../../apis/feedbackApi/feedbackApi';
import { getPatientById } from '../../apis/patientApi/updateProfileApi';

const HomePage = () => {
  const navigate = useNavigate();
  const bookingAppointmentPath = "/schedule-consultation";
  const [openFaq, setOpenFaq] = useState(null);
  const [consultantDoctors, setConsultantDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialNames, setTestimonialNames] = useState({});
  const [testimonialLoading, setTestimonialLoading] = useState(false);
  const [testimonialError, setTestimonialError] = useState(null);
  const [testimonialProfiles, setTestimonialProfiles] = useState({});

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

  // Fetch consultant doctors on mount
  useEffect(() => {
    getDoctorsBySpecialty("Consultant")
      .then(res => setConsultantDoctors(res.data.data || []))
      .catch(() => setConsultantDoctors([]));
  }, []);

  // Fetch blogs for news section
  useEffect(() => {
    getAllBlogs()
      .then(data => setBlogs(data.slice(0, 3))) // lấy 3 bài mới nhất
      .catch(() => setBlogs([]));
  }, []);

  // Fetch 3 latest feedbacks for testimonials
  useEffect(() => {
    setTestimonialLoading(true);
    setTestimonialError(null);
    getFeedbacks({ page: 1, pageSize: 3, sort: 'desc' })
      .then(res => {
        const fb = res.data?.data?.feedbacks || res.data?.data || [];
        setTestimonials(fb.slice(0, 3));
      })
      .catch(() => setTestimonialError('Could not load testimonials'))
      .finally(() => setTestimonialLoading(false));
  }, []);

  // Fetch patient username for each feedback
  useEffect(() => {
    const fetchNames = async () => {
      const missingIds = testimonials
        .map(fb => fb.patientId)
        .filter(pid => pid && !testimonialNames[pid]);
      const uniqueIds = [...new Set(missingIds)];
      if (uniqueIds.length === 0) return;
      const updates = {};
      await Promise.all(uniqueIds.map(async (pid) => {
        try {
          const res = await getPatientById(pid);
          const username = res.data?.data?.account?.username || null;
          if (username) updates[pid] = username;
        } catch {
          updates[pid] = null;
        }
      }));
      if (Object.keys(updates).length > 0) {
        setTestimonialNames(prev => ({ ...prev, ...updates }));
      }
    };
    if (testimonials.length > 0) fetchNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials]);

  // Fetch patient profile (fullName, profileImageUrl) for each feedback
  useEffect(() => {
    const fetchProfiles = async () => {
      const missingIds = testimonials
        .map(fb => fb.patientId)
        .filter(pid => pid && !testimonialProfiles[pid]);
      const uniqueIds = [...new Set(missingIds)];
      if (uniqueIds.length === 0) return;
      const updates = {};
      await Promise.all(uniqueIds.map(async (pid) => {
        try {
          const res = await getPatientById(pid);
          const account = res.data?.data?.account || {};
          updates[pid] = {
            fullName: account.fullName || account.username || 'Anonymous',
            profileImageUrl: account.profileImageUrl || null
          };
        } catch {
          updates[pid] = { fullName: 'Anonymous', profileImageUrl: null };
        }
      }));
      if (Object.keys(updates).length > 0) {
        setTestimonialProfiles(prev => ({ ...prev, ...updates }));
      }
    };
    if (testimonials.length > 0) fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials]);

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
            {testimonialLoading ? (
              <div className="col-span-3 text-center text-gray-500">Loading...</div>
            ) : testimonialError ? (
              <div className="col-span-3 text-center text-red-500">{testimonialError}</div>
            ) : testimonials.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">No testimonials yet</div>
            ) : (
              testimonials.map((fb, idx) => (
                <div key={fb.feedbackId || idx} className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(fb.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      {[...Array(5 - (fb.rating || 0))].map((_, i) => (
                        <Star key={100 + i} className="w-5 h-5 text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{fb.comment || 'No comment'}</p>
                  <div className="flex items-center mt-auto">
                    {testimonialProfiles[fb.patientId]?.profileImageUrl ? (
                      <img
                        src={testimonialProfiles[fb.patientId].profileImageUrl}
                        alt={testimonialProfiles[fb.patientId].fullName}
                        className="w-10 h-10 rounded-full object-cover mr-3 border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonialProfiles[fb.patientId]?.fullName || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{fb.createdAt ? `Feedback on ${new Date(fb.createdAt).toLocaleDateString()}` : ''}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
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

      {/* Latest News Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest Health News & Updates
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed with the latest developments in HIV treatment and prevention
            </p>
          </div>
          <div className="flex justify-center md:justify-end mb-6">
            <button
              className="group flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={() => navigate('/blogs-page')}
            >
              Read More
              <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog.blogId}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border flex flex-col cursor-pointer hover:ring-2 hover:ring-cyan-400 h-full"
                onClick={() => navigate(`/blog/${blog.blogId}`)}
              >
                <div className="relative">
                  <img
                    src={blog.blogImageUrl}
                    alt={blog.title}
                    className="w-full h-52 object-cover"
                  />
                  {blog.blogTagName && (
                    <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      {blog.blogTagName}
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">{blog.content?.substring(0, 120)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact Banner */}
      <div className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Emergency Support Available 24/7</h3>
          </div>
          <p className="text-lg mb-4">
            If you need immediate assistance or have urgent health concerns, our emergency hotline is always available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-xl font-bold">Emergency: 1900-xxxx</span>
            </div>
            <button 
              onClick={() => navigate(bookingAppointmentPath)}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Urgent Consultation
            </button>
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

      {/* Section: Book Consultant Doctor */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book a Consultant Doctor
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose a consultant doctor for your needs and book a consultation easily.
            </p>
          </div>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {consultantDoctors.map(doc => (
              <DoctorCard
                key={doc.doctorId}
                doctor={doc}
                onBook={() => navigate(`/schedule-consultation?doctorId=${doc.doctorId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}

export default HomePage
