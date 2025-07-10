import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Star, GraduationCap, Building2, Calendar, Award, ClipboardCheck } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDoctors } from '../../redux/feature/doctorSlice';
import { fetchDoctorExperience } from '../../redux/feature/experienceWorkingSlice';
import { fetchCertificatesByDoctorId } from '../../redux/feature/certificateSlice';
import dayjs from 'dayjs';

const DoctorDetail = ({ onBook }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const { doctors, status: doctorStatus } = useSelector((state) => state.doctor);
  const { doctorExperiences, status: experienceStatus } = useSelector((state) => state.experienceWorking);
  const { certificates, status: certificateStatus } = useSelector((state) => state.certificates);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        // Fetch all required data
        await Promise.all([
          dispatch(fetchAllDoctors()),
          dispatch(fetchDoctorExperience(id)),
          dispatch(fetchCertificatesByDoctorId(id))
        ]);
      } catch (err) {
        setError("Failed to load doctor information. Please try again later.");
        console.error("Error fetching doctor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [dispatch, id]);

  // Update doctor when data changes
  useEffect(() => {
    if (doctors?.data) {
      const foundDoctor = doctors.data.find(doc => doc.doctorId === parseInt(id));
      setDoctor(foundDoctor || null);
    }
  }, [doctors, id]);

  const formatDate = (dateString) => {
    return dayjs(dateString).format('MM/DD/YYYY');
  };

  if (loading || doctorStatus === 'loading' || experienceStatus === 'loading' || certificateStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#0072BC]"></div>
      </div>
    );
  }

  if (error || doctorStatus === 'failed' || experienceStatus === 'failed' || certificateStatus === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || "An error occurred while loading information"}</p>
        <Link to="/doctors" className="text-[#0072BC] hover:underline">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Doctor information not found</p>
        <Link to="/doctors" className="text-[#0072BC] hover:underline">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-[#0072BC] hover:underline">Home page</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Doctor detail</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{doctor.fullName}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Doctor Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            {doctor.profileImageUrl ? (
              <img
                src={doctor.profileImageUrl}
                alt={doctor.fullName}
                className="w-64 h-64 object-cover rounded-lg mx-auto mb-4"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <h1 className="text-2xl font-bold text-[#0072BC] mb-2">{doctor.fullName}</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">5 out of 5</span>
            </div>
            <button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-lg px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={() => {
                if (onBook) onBook(doctor);
                navigate(`/schedule-consultation?doctorId=${doctor.doctorId}`, {
                  state: {
                    selectedDoctor: doctor.doctorId,
                    doctorName: doctor.fullName
                  }
                });
              }}
            >
              Book an Appointment
            </button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          {/* Introduction */}
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600">{doctor.shortDescription}</p>
          </section>

          {/* Specialization */}
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Specialization</h2>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <GraduationCap className="w-5 h-5 text-[#0072BC]" />
              <span>{doctor.specialty}</span>
            </div>
            {doctor.yearsOfExperience && (
              <div className="text-gray-600 mt-2">
                Years of Experience: {doctor.yearsOfExperience} years
              </div>
            )}
          </section>

          {/* Work Experience */}
          {doctorExperiences && doctorExperiences.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Work Experience</h2>
              {doctorExperiences.map((exp) => (
                <div key={exp.experienceId} className="mb-4 last:mb-0">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-5 h-5 text-[#0072BC] mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{exp.hospitalName}</h3>
                      <p className="text-gray-600">{exp.position}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.fromDate)} - {exp.toDate ? formatDate(exp.toDate) : 'Present'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Certificates */}
          {certificates && certificates.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Certificates</h2>
              {certificates.map((cert) => (
                <div key={cert.certificateId} className="mb-4 last:mb-0">
                  <div className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-[#0072BC] mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{cert.title}</h3>
                      <p className="text-gray-600">{cert.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Issue Date: {formatDate(cert.issuedDate)}</span>
                        <span className="text-gray-400">|</span>
                        <span>Issued By: {cert.issuedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail; 