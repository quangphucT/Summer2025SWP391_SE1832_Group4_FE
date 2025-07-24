import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Star, GraduationCap, Building2, Calendar, Award, ClipboardCheck } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDoctors } from '../../redux/feature/doctorSlice';
import { fetchDoctorExperience } from '../../redux/feature/experienceWorkingSlice';
import { fetchCertificatesByDoctorId } from '../../redux/feature/certificateSlice';
import dayjs from 'dayjs';
import { getPatientById } from '../../apis/patientApi/updateProfileApi';
import { Spin } from 'antd';
import { getFeedbackRatingStatisticsByDoctorId } from '../../apis/feedbackApi/feedbackApi';
import { getFeedbacks } from '../../apis/feedbackApi/feedbackApi';

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
  const [feedbacks, setFeedbacks] = useState([]);
  const [patientNames, setPatientNames] = useState({});
  const [avgRating, setAvgRating] = useState(null);
  const [patientProfiles, setPatientProfiles] = useState({});

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

  // Lấy feedbacks bằng getFeedbacks({ doctorId })
  useEffect(() => {
    let isMounted = true;
    setFeedbacks([]);
    getFeedbacks({ doctorId: id })
      .then(res => {
        if (isMounted) {
          const fb = res.data?.data?.feedbacks || res.data?.data || [];
          setFeedbacks(fb);
        }
      })
      .catch(() => {
        if (isMounted) setFeedbacks([]);
      });
    return () => { isMounted = false; };
  }, [id]);

  // Lấy rating trung bình và feedbacks từ API statistics duy nhất
  useEffect(() => {
    let isMounted = true;
    setAvgRating(null);
    setFeedbacks([]);
    getFeedbackRatingStatisticsByDoctorId(id)
      .then(res => {
        if (isMounted) {
          const data = res.data?.data || {};
          // Lấy rating trung bình
          const avg = data.averageRating;
          setAvgRating(typeof avg === 'number' ? avg : null);
          // Lấy danh sách feedbacks (giả sử là data.feedbackList hoặc data.feedbacks)
          const fb = data.feedbackList || data.feedbacks || [];
          setFeedbacks(fb);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAvgRating(null);
          setFeedbacks([]);
        }
      });
    return () => { isMounted = false; };
  }, [id]);

  // Lấy tên bệnh nhân cho từng feedback (chỉ khi chưa có)
  useEffect(() => {
    const fetchNames = async () => {
      const missingIds = feedbacks
        .map(fb => fb.patientId)
        .filter(pid => pid && !patientNames[pid]);
      // Loại bỏ trùng lặp
      const uniqueIds = [...new Set(missingIds)];
      if (uniqueIds.length === 0) return;
      const updates = {};
      await Promise.all(uniqueIds.map(async (pid) => {
        try {
          const res = await getPatientById(pid);
          // Lấy username từ res.data.data.account.username
          const username = res.data?.data?.account?.username || null;
          if (username) updates[pid] = username;
        } catch {
          updates[pid] = null;
        }
      }));
      if (Object.keys(updates).length > 0) {
        setPatientNames(prev => ({ ...prev, ...updates }));
      }
    };
    if (feedbacks.length > 0) fetchNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbacks]);

  // Lấy profile (fullName, profileImageUrl) cho từng feedback (chỉ khi chưa có)
  useEffect(() => {
    const fetchProfiles = async () => {
      const missingIds = feedbacks
        .map(fb => fb.patientId)
        .filter(pid => pid && !patientProfiles[pid]);
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
        setPatientProfiles(prev => ({ ...prev, ...updates }));
      }
    };
    if (feedbacks.length > 0) fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbacks]);

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
        <Link to="/" className="text-[#0072BC] hover:underline">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Doctor information not found</p>
        <Link to="/" className="text-[#0072BC] hover:underline">
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
                {[...Array(avgRating !== null ? Math.floor(avgRating) : 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(5 - (avgRating !== null ? Math.floor(avgRating) : 5))].map((_, i) => (
                  <Star key={100 + i} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              <span className="text-gray-600">{avgRating !== null ? avgRating.toFixed(1) : 5} out of 5</span>
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
            {/* Feedback Section */}
            <div className="mt-6 text-left">
              <div className="font-semibold text-gray-800 mb-2 text-base">Patient Feedback</div>
              {feedbacks.length === 0 ? (
                <div className="text-gray-500 text-sm">No feedback yet</div>
              ) : (
                <div className="space-y-3">
                  {feedbacks.map((fb, idx) => (
                    <div key={fb.feedbackId || idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        {patientProfiles[fb.patientId]?.profileImageUrl ? (
                          <img
                            src={patientProfiles[fb.patientId].profileImageUrl}
                            alt={patientProfiles[fb.patientId].fullName}
                            className="w-8 h-8 rounded-full object-cover mr-2 border"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        )}
                        <span className="font-medium text-blue-700 text-sm">{patientProfiles[fb.patientId]?.fullName || 'Anonymous'}</span>
                        <span className="flex items-center gap-0.5">
                          {[...Array(fb.rating || 0)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {[...Array(5 - (fb.rating || 0))].map((_, i) => (
                            <Star key={100 + i} className="w-4 h-4 text-gray-300" />
                          ))}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <div className="text-gray-700 text-sm">{fb.comment || 'No comment'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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