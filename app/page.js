'use client';

import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon,
  Megaphone, 
  PlusCircle, 
  ThumbsUp, 
  User, 
  MapPin, 
  Search, 
  X, 
  Lock, 
  Globe, 
  Building2,
  Plus,
  Image as ImageIcon,
  Camera,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Bell,
  Activity,
  AlertCircle,
  Map,
  Lightbulb,
  Droplets,
  Trash2,
  Zap,
  Waves,
  MoreHorizontal,
  PenSquare,
  Filter,
  CheckCircle,
  Circle,
  Navigation,
  Smartphone,
  KeyRound,
  ArrowRight,
  Loader2,
  LogOut
} from 'lucide-react';

// Custom SVG Logo component
const CustomCommunityLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 185 C80 160 52 120 52 90 C52 60 73 38 100 38 C127 38 148 60 148 90 C148 120 120 160 100 185 Z" fill="#0D5C63" />
    <path d="M100 185 C100 185 118 150 125 125 C115 132 105 135 100 135 C95 135 85 132 75 125 C82 150 100 185 100 185 Z" fill="#149A88" />
    <circle cx="100" cy="85" r="18" fill="white" />
    <circle cx="100" cy="22" r="11" fill="#0D4763" />
    <path d="M82 48 C82 38 118 38 118 48 L112 65 L88 65 Z" fill="#0D4763" />
    <circle cx="58" cy="35" r="10" fill="#2AA990" />
    <path d="M42 58 C46 48 72 45 76 56 L68 70 L50 64 Z" fill="#2AA990" />
    <circle cx="142" cy="35" r="10" fill="#2AA990" />
    <path d="M158 58 C154 48 128 45 124 56 L132 70 L150 64 Z" fill="#2AA990" />
    <circle cx="32" cy="68" r="9" fill="#229B85" />
    <circle cx="168" cy="68" r="9" fill="#229B85" />
  </svg>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('feed'); 
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const [publicSortBy, setPublicSortBy] = useState('upvoted');
  const [privateStatusFilter, setPrivateStatusFilter] = useState('Filed');
  const [statusFilter, setStatusFilter] = useState('All');
  const [distanceFilter, setDistanceFilter] = useState('All');

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: 'guest_user',
    name: 'Guest User',
    phone: '',
    address: 'Select Ward Location',
    pincode: '',
    ward: 'Local Ward',
    role: 'resident',
    department: 'BESCOM',
    designation: 'Resident',
    locationType: 'manual',
    fullAddress: ''
  });

  const officialTabs = ['All', 'BESCOM', 'BWSSB', 'BBMP', 'Health', 'Transport', 'Other'];

  const getStatusColorStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'filed':
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in progress':
      case 'under review':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSelectedBorderStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'filed':
      case 'open':
        return 'border-blue-500 ring-1 ring-blue-500 shadow-sm';
      case 'in progress':
      case 'under review':
        return 'border-yellow-400 ring-1 ring-yellow-400 shadow-sm';
      case 'resolved':
        return 'border-emerald-500 ring-1 ring-emerald-500 shadow-sm';
      default:
        return 'border-teal-500 ring-1 ring-teal-500 shadow-sm';
    }
  };

  const getTimelineStepStyle = (stepName, isCompleted) => {
    if (!isCompleted) return 'bg-slate-100 border-slate-300 text-slate-300';
    switch (stepName?.toLowerCase()) {
      case 'filed':
      case 'complaint filed':
      case 'open':
        return 'bg-blue-600 border-blue-600 text-white';
      case 'in progress':
      case 'under review':
        return 'bg-yellow-500 border-yellow-500 text-white';
      case 'resolved':
        return 'bg-emerald-600 border-emerald-600 text-white';
      default:
        return 'bg-teal-600 border-teal-600 text-white';
    }
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      authorId: 'usr_official',
      title: 'Scheduled Power Outage for Transformer Maintenance',
      description: 'Power supply will be interrupted tomorrow from 10:00 AM to 2:00 PM in the local layout due to regular line upgrades.',
      author: 'Lineman - BESCOM',
      isOfficial: true,
      isPrivate: false,
      department: 'BESCOM',
      subDepartment: 'Karnataka Electricity Supply Company',
      tags: ['#Electricity', '#PowerOutage'],
      upvotes: 0,
      createdAt: 1727280000000,
      time: 'Today • 10:00 AM - 2:00 PM',
      status: 'Official Department Notice',
      mediaUrl: '',
      mediaType: 'image',
      comments: []
    },
    {
      id: 5,
      authorId: 'usr_official2',
      title: 'Water Supply Disruption in Some Areas',
      description: 'Due to maintenance work, water supply will be affected in the following areas from 9:00 AM to 1:00 PM today.',
      author: 'Engineer - BWSSB',
      isOfficial: true,
      isPrivate: false,
      department: 'BWSSB',
      subDepartment: 'Bangalore Water Supply and Sewerage Board',
      tags: ['#Water'],
      upvotes: 0,
      createdAt: 1727270000000,
      time: 'Today • 9:00 AM - 1:00 PM',
      status: 'Official Update',
      mediaUrl: '',
      mediaType: '',
      comments: []
    },
    {
      id: 6,
      authorId: 'usr_official3',
      title: 'Garbage Collection Schedule Update',
      description: 'Garbage collection in some areas will be delayed by 1 day due to vehicle maintenance.',
      author: 'Health Inspector - BBMP',
      isOfficial: true,
      isPrivate: false,
      department: 'BBMP',
      subDepartment: 'Bruhat Bengaluru Mahanagara Palike',
      tags: ['#Garbage'],
      upvotes: 0,
      createdAt: 1727260000000,
      time: 'Today',
      status: 'Notice',
      mediaUrl: '',
      mediaType: '',
      comments: []
    },
    {
      id: 2,
      authorId: 'usr_202',
      title: 'Large Pothole Near 5th Main Road',
      description: 'A deep pothole has opened up right after the rain. High risk for two-wheelers during peak hours.',
      author: 'Kiran Kumar',
      isOfficial: false,
      isPrivate: false,
      department: 'BBMP Roads',
      tags: ['#Roads', '#SafetyHazard'],
      upvotes: 28,
      createdAt: 1727272800000,
      time: '4 hours ago',
      status: 'In Progress',
      mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop',
      mediaType: 'image',
      comments: [
        { author: 'Priya S', text: 'Upvoted! Almost skidded here yesterday evening.' }
      ]
    },
    {
      id: 4,
      authorId: 'usr_101', 
      title: 'Private Billing Discrepancy & Meter Fault',
      description: 'My electricity meter recorded double the regular units for August. Requesting technical inspection.',
      author: 'Resident User',
      isOfficial: false,
      isPrivate: true,
      department: 'BESCOM',
      tags: ['#Electricity', '#MeterIssue'],
      upvotes: 0,
      createdAt: 1727193600000,
      time: '1 day ago',
      status: 'In Progress', 
      mediaUrl: '',
      mediaType: '',
      timeline: [
        { name: 'Filed', title: 'Complaint Filed', time: 'Yesterday at 10:15 AM', details: 'Water leakage ticket logged.', completed: true },
        { name: 'In Progress', title: 'In Progress', time: 'Yesterday at 02:30 PM', details: 'Executive Engineer Suresh Kumar dispatched.', completed: true },
        { name: 'Resolved', title: 'Resolved', time: 'Pending', details: 'Meter recalibration and site resolution.', completed: false }
      ],
      comments: [
        { author: 'BESCOM Admin', text: 'Complaint registered (Ref #88412). Inspector assigned.' }
      ]
    },
    {
      id: 7,
      authorId: 'usr_101', 
      title: 'Streetlight Blown Bulb near Park Gate',
      description: 'Complaint lodged regarding dark stretch on 2nd Cross road.',
      author: 'Resident User',
      isOfficial: false,
      isPrivate: true,
      department: 'BBMP',
      tags: ['#Streetlights'],
      upvotes: 0,
      createdAt: 1727100000000,
      time: '2 days ago',
      status: 'Filed', 
      mediaUrl: '',
      mediaType: '',
      timeline: [
        { name: 'Filed', title: 'Complaint Filed', time: '2 days ago at 09:00 AM', details: 'Report submitted and sent to Ward Electrical Dept.', completed: true },
        { name: 'In Progress', title: 'In Progress', time: 'Pending Review', details: 'Awaiting field crew allocation.', completed: false },
        { name: 'Resolved', title: 'Resolved', time: 'Pending', details: 'Bulb replacement and wiring check.', completed: false }
      ],
      comments: []
    },
    {
      id: 8,
      authorId: 'usr_101', 
      title: 'Broken Pipeline Leakage Repaired',
      description: 'Water leak issue reported last week is now completely fixed by BWSSB team.',
      author: 'Resident User',
      isOfficial: false,
      isPrivate: true,
      department: 'BWSSB',
      tags: ['#Water'],
      upvotes: 0,
      createdAt: 1726900000000,
      time: '4 days ago',
      status: 'Resolved', 
      mediaUrl: '',
      mediaType: '',
      timeline: [
        { name: 'Filed', title: 'Complaint Filed', time: 'Sep 20, 2026 at 11:30 AM', details: 'Water leakage ticket logged.', completed: true },
        { name: 'In Progress', title: 'In Progress', time: 'Sep 21, 2026 at 08:45 AM', details: 'BWSSB maintenance team dispatched.', completed: true },
        { name: 'Resolved', title: 'Resolved', time: '4 days ago at 04:15 PM', details: 'Pipe joint replaced and water pressure restored.', completed: true }
      ],
      comments: []
    }
  ]);

  const [newPost, setNewPost] = useState({ 
    title: '', description: '', department: 'BESCOM', isPrivate: false, tags: ['#Electricity'], mediaUrl: '', mediaType: 'image'
  });
  const [commentText, setCommentText] = useState('');

  // --- STEP A: Fetch Posts from Supabase on Load ---
  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // AFTER
if (error) {
  console.error('Supabase Error Code:', error.code);
  console.error('Supabase Error Message:', error.message);
  console.error('Supabase Error Details:', error.details);
}
      } else if (data && data.length > 0) {
        const mappedPosts = data.map(item => ({
          id: item.id,
          authorId: item.author_id || 'usr_supabase',
          title: item.title,
          description: item.description,
          author: item.author || 'Resident User',
          isOfficial: item.is_official || false,
          isPrivate: item.is_private || false,
          department: item.department || 'General',
          subDepartment: item.sub_department || '',
          tags: item.tags || ['#General'],
          upvotes: item.upvotes || 0,
          createdAt: new Date(item.created_at).getTime() || Date.now(),
          time: 'Recently',
          status: item.status || 'Filed',
          mediaUrl: item.media_url || '',
          mediaType: item.media_type || 'image',
          comments: item.comments || [],
          timeline: item.timeline || [
            { name: 'Filed', title: 'Complaint Filed', time: 'Recently', details: 'Ticket received and queued.', completed: true },
            { name: 'In Progress', title: 'In Progress', time: 'Pending Review', details: 'Awaiting field crew allocation.', completed: false },
            { name: 'Resolved', title: 'Resolved', time: 'Pending', details: 'Awaiting resolution.', completed: false }
          ]
        }));
        setPosts(mappedPosts);
      }
      setLoading(false);
    }

    loadPosts();
  }, []);

  // --- STEP B: Save New Post / Issue to Supabase ---
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login first to report an issue.");
      setIsPostModalOpen(false);
      setIsLoginOpen(true);
      return;
    }

    const isOfficialUser = user.role !== 'resident';
    const authorName = `${user.name}${isOfficialUser ? ` (${user.designation})` : ''}`;
    const postTags = newPost.tags.length > 0 ? newPost.tags : [`#${isOfficialUser ? user.department : 'General'}`];
    const initialStatus = isOfficialUser ? 'Official Department Notice' : 'Filed';

    const newPostData = {
      title: newPost.title,
      description: newPost.description,
      author: authorName,
      author_id: user.id,
      department: isOfficialUser ? user.department : newPost.department,
      tags: postTags,
      is_official: isOfficialUser,
      is_private: isOfficialUser ? false : newPost.isPrivate,
      upvotes: 0,
      status: initialStatus,
      media_url: newPost.mediaUrl,
      media_type: newPost.mediaType
    };

    // 1. Optimistic UI insertion locally
    const createdLocal = {
      id: Date.now(),
      authorId: user.id,
      title: newPost.title,
      description: newPost.description,
      author: authorName,
      isOfficial: isOfficialUser,
      isPrivate: isOfficialUser ? false : newPost.isPrivate,
      department: isOfficialUser ? user.department : newPost.department,
      tags: postTags,
      upvotes: 0,
      createdAt: Date.now(),
      time: 'Just now',
      status: initialStatus,
      mediaUrl: newPost.mediaUrl,
      mediaType: newPost.mediaType,
      comments: [],
      timeline: [
        { name: 'Filed', title: 'Complaint Filed', time: 'Just now', details: 'Ticket received and queued.', completed: true },
        { name: 'In Progress', title: 'In Progress', time: 'Pending Review', details: 'Awaiting field crew allocation.', completed: false },
        { name: 'Resolved', title: 'Resolved', time: 'Pending', details: 'Awaiting resolution.', completed: false }
      ]
    };
    setPosts(prev => [createdLocal, ...prev]);

    // 2. Persist to Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert([newPostData])
      .select();

    if (error) {
      console.error('Error saving post to Supabase:', error);
    } else if (data && data.length > 0) {
      const dbPost = data[0];
      setPosts(prev => prev.map(p => p.id === createdLocal.id ? { ...p, id: dbPost.id } : p));
    }

    setNewPost({ title: '', description: '', department: 'BESCOM', isPrivate: false, tags: ['#Electricity'], mediaUrl: '', mediaType: 'image' });
    setIsPostModalOpen(false);
  };

  // --- STEP C: Real-Time Upvote Handler ---
  const handleUpvote = async (id, e) => {
    e.stopPropagation();

    const targetPost = posts.find(p => p.id === id);
    if (!targetPost) return;

    const newUpvoteCount = (targetPost.upvotes || 0) + 1;

    // Optimistic UI update
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: newUpvoteCount } : p));
    if (selectedPost?.id === id) {
      setSelectedPost(prev => ({ ...prev, upvotes: newUpvoteCount }));
    }

    // Database update
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: newUpvoteCount })
      .eq('id', id);

    if (error) {
      console.error('Error updating upvote in Supabase:', error);
      // Rollback on error
      setPosts(posts.map(p => p.id === id ? { ...p, upvotes: targetPost.upvotes } : p));
      if (selectedPost?.id === id) {
        setSelectedPost(prev => ({ ...prev, upvotes: targetPost.upvotes }));
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setIsCameraActive(true);
    } catch (err) { alert("Unable to access camera permissions."); }
  };

  const stopCamera = () => {
    if (videoStream) { videoStream.getTracks().forEach(track => track.stop()); setVideoStream(null); }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const videoElem = document.getElementById('webcam-preview');
    if (!videoElem) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoElem.videoWidth || 640;
    canvas.height = videoElem.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
    setNewPost({ ...newPost, mediaUrl: canvas.toDataURL('image/jpeg'), mediaType: 'image' });
    stopCamera();
  };

  const handleLoginSuccess = (userData) => {
    setUser({
      id: 'usr_' + Date.now(),
      name: userData.fullName,
      phone: userData.phoneNumber,
      role: userData.role,
      department: userData.department,
      designation: userData.designation,
      locationType: userData.locationType,
      ward: userData.ward,
      pincode: userData.pincode,
      address: userData.area,
      fullAddress: userData.fullAddress
    });
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({
      id: 'guest_user',
      name: 'Guest User',
      phone: '',
      address: 'Select Ward Location',
      pincode: '',
      ward: 'Local Ward',
      role: 'resident',
      department: 'BESCOM',
      designation: 'Resident',
      locationType: 'manual',
      fullAddress: ''
    });
    setSelectedPost(null);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost || selectedPost.isOfficial) return;
    const newComment = { author: `${user.name} ${user.role !== 'resident' ? `[${user.designation}]` : ''}`, text: commentText };
    setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, comments: [...(p.comments || []), newComment] } : p));
    setSelectedPost(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
    setCommentText('');
  };

  const filteredPosts = posts.filter(post => {
    if (post.isPrivate && post.authorId !== user.id && !(user.role !== 'resident' && user.department === post.department)) return false;
    
    if (activeTab === 'announcements') {
      if (!post.isOfficial) return false;
      if (selectedChannel === 'all' || selectedChannel === 'All') return true;
      if (selectedChannel === 'Other') return !['BESCOM', 'BBMP', 'BWSSB', 'Health', 'Transport'].some(d => post.department.includes(d));
      return post.department.toUpperCase().includes(selectedChannel.toUpperCase());
    }
    
    if (activeTab === 'feed') {
      if (post.isPrivate || post.isOfficial) return false;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Open' && post.status.toLowerCase() !== 'filed' && post.status.toLowerCase() !== 'open') return false;
        if (statusFilter === 'Under Review' && post.status.toLowerCase() !== 'in progress' && post.status.toLowerCase() !== 'under review') return false;
        if (statusFilter === 'Resolved' && post.status.toLowerCase() !== 'resolved') return false;
      }
      if (selectedChannel === 'all' || selectedChannel === 'All') return true;
      return post.tags.some(t => t.toLowerCase() === selectedChannel.toLowerCase());
    }
    
    if (activeTab === 'private') {
      if (!post.isPrivate) return false;
      if (privateStatusFilter === 'All') return true;
      return post.status.toLowerCase() === privateStatusFilter.toLowerCase();
    }
    
    if (activeTab === 'home') {
      return post.isOfficial;
    }

    return true;
  }).sort((a, b) => (activeTab === 'feed' && publicSortBy === 'upvoted') ? b.upvotes - a.upvotes : b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3 w-1/4">
          <div className="p-1 rounded-lg">
            <CustomCommunityLogo className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900 tracking-tight">LocalPulse</h1>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-teal-600" /> {user.ward || 'Your Local Ward'}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search local issues, departments, or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-1/4 justify-end">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>

          {/* DYNAMIC AUTH / LOGOUT BUTTON */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-teal-50 border border-teal-200 hover:bg-teal-100 px-3 py-1.5 rounded-full text-xs font-semibold text-teal-900 transition"
              >
                <div className="p-1 rounded-full bg-teal-600 text-white">
                  {user.role === 'resident' ? <User className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </button>

              <button 
                onClick={handleLogout}
                title="Logout"
                className="flex items-center gap-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* COLUMN 1: LEFT NAVIGATION SIDEBAR */}
        <aside className="lg:col-span-2 space-y-6 flex flex-col justify-between h-[calc(100vh-100px)] sticky top-24">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">MENU</p>
            
            <button 
              onClick={() => { setActiveTab('home'); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'home' 
                  ? 'bg-teal-50 text-teal-800 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HomeIcon className={`w-4 h-4 ${activeTab === 'home' ? 'text-teal-600' : ''}`} />
              <span>Home</span>
            </button>

            <button 
              onClick={() => { setActiveTab('announcements'); setSelectedChannel('All'); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'announcements' 
                  ? 'bg-teal-50 text-teal-800 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Megaphone className={`w-4 h-4 ${activeTab === 'announcements' ? 'text-teal-600' : ''}`} />
              <span>Official Updates</span>
            </button>

            <button 
              onClick={() => { setActiveTab('feed'); setSelectedChannel('All'); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className={`w-4 h-4 ${activeTab === 'feed' ? 'text-indigo-600' : ''}`} />
              <span>Public Issues</span>
            </button>

            <button 
              onClick={() => { setActiveTab('private'); setSelectedChannel('All'); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'private' 
                  ? 'bg-rose-50 text-rose-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Lock className={`w-4 h-4 ${activeTab === 'private' ? 'text-rose-600' : ''}`} />
              <span>My Complaints</span>
            </button>

            <div className="pt-4">
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>
            </div>
          </div>

          <div className="bg-[#EEF8F6] p-4 rounded-2xl border border-teal-100 text-center relative overflow-hidden">
            <h4 className="text-xs font-bold text-teal-900 mb-1 z-10 relative">Your voice matters</h4>
            <p className="text-[10px] text-teal-700 mb-3 z-10 relative">Together we build a cleaner, safer and better community.</p>
            <div className="opacity-50 mt-4 h-10 w-full flex justify-center">
               <CustomCommunityLogo className="w-12 h-12 text-teal-600 absolute -bottom-2" />
            </div>
          </div>
        </aside>

        {/* COLUMN 2: CENTRAL DASHBOARD MAIN */}
        <main className="lg:col-span-7 space-y-6">
          
          {/* ---- HOME PAGE VIEW ---- */}
          {activeTab === 'home' && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Good morning, {user.name.split(' ')[0]} 👋</h2>
                <p className="text-xs text-slate-500 mb-4">Here's what's happening in your ward today.</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
                    <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500"><AlertCircle className="w-5 h-5" /></div>
                    <div><p className="text-xl font-bold text-slate-800">3</p><p className="text-[10px] text-slate-500 font-medium">Active Issues</p></div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
                    <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500"><Clock className="w-5 h-5" /></div>
                    <div><p className="text-xl font-bold text-slate-800">5</p><p className="text-[10px] text-slate-500 font-medium">Under Review</p></div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-500"><CheckCircle2 className="w-5 h-5" /></div>
                    <div><p className="text-xl font-bold text-slate-800">12</p><p className="text-[10px] text-slate-500 font-medium">Resolved</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600" /> Report a Local Problem
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">Help us make your ward a better place. Report issues like roads, streetlights, water, garbage, electricity and more.</p>
                  </div>
                  <button onClick={() => setIsPostModalOpen(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-700 transition shadow-xs shrink-0">
                    <Plus className="w-3.5 h-3.5" /> Report an Issue →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {[
                      { icon: Map, label: 'Roads', tag: '#Roads' },
                      { icon: Lightbulb, label: 'Streetlights', tag: '#Streetlights' },
                      { icon: Droplets, label: 'Water', tag: '#Water' },
                      { icon: Trash2, label: 'Garbage', tag: '#Garbage' },
                      { icon: Zap, label: 'Electricity', tag: '#Electricity' },
                      { icon: Waves, label: 'Drainage', tag: '#Drainage' },
                      { icon: MoreHorizontal, label: 'Other', tag: 'custom_tags' }
                    ].map((cat, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => { setActiveTab('feed'); setSelectedChannel(cat.tag); }}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-transparent bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition"
                      >
                        <cat.icon className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                        <span className="text-[9px] font-bold">{cat.label}</span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <Megaphone className="w-4 h-4 text-teal-600" /> Official Updates
                  </h3>
                  <button onClick={() => { setActiveTab('announcements'); setSelectedChannel('All'); }} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                    View all →
                  </button>
                </div>

                {filteredPosts.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-teal-200 transition cursor-pointer relative overflow-hidden shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          post.department.includes('BESCOM') ? 'bg-blue-100 text-blue-600' : 
                          post.department.includes('BWSSB') ? 'bg-cyan-100 text-cyan-600' : 
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                            {post.department} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          </h4>
                          {post.subDepartment && <p className="text-[10px] text-slate-400">{post.subDepartment}</p>}
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3" /> Official Department Notice
                      </span>
                    </div>

                    <div className="ml-[52px] mt-2">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{post.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">{post.description}</p>
                      
                      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Local Ward</span>
                        </div>
                        <span className="text-teal-600 font-bold flex items-center gap-1 hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---- OFFICIAL UPDATES TAB VIEW ---- */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-teal-600" /> Official Updates
                </h2>
                <p className="text-xs text-slate-500">Latest announcements and notices from government departments and local authorities.</p>
              </div>
              
              <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
                {officialTabs.map(dept => (
                  <button 
                    key={dept}
                    onClick={() => setSelectedChannel(dept)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-colors shrink-0 ${
                      selectedChannel === dept 
                        ? 'bg-teal-700 text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-teal-200 transition cursor-pointer relative overflow-hidden shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          post.department.includes('BESCOM') ? 'bg-blue-100 text-blue-600' : 
                          post.department.includes('BWSSB') ? 'bg-cyan-100 text-cyan-600' : 
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                            {post.department} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          </h4>
                          {post.subDepartment && <p className="text-[10px] text-slate-400">{post.subDepartment}</p>}
                        </div>
                      </div>

                      <span className={`flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
                        post.status === 'Important' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        post.status === 'Notice' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {post.status.includes('Notice') && <CheckCircle2 className="w-3 h-3" />}
                        {post.status}
                      </span>
                    </div>

                    <div className="ml-[52px] mt-2">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{post.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">{post.description}</p>
                      
                      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Ward 12</span>
                        </div>
                        <span className="text-teal-600 font-bold flex items-center gap-1 hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- PUBLIC ISSUES TAB VIEW ---- */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-indigo-600" /> Public Issues Stream
                </h3>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <select value={publicSortBy} onChange={(e) => setPublicSortBy(e.target.value)} className="bg-white border border-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-lg focus:outline-none">
                    <option value="upvoted">Most Upvoted</option>
                    <option value="latest">Latest</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                  Loading feed from Supabase...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                  No public issues reported yet. Be the first to post!
                </div>
              ) : (
                filteredPosts.map(post => {
                  const isSelected = selectedPost?.id === post.id;
                  return (
                    <div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-5 rounded-2xl border bg-white transition cursor-pointer space-y-3 ${
                        isSelected 
                          ? getSelectedBorderStyle(post.status) 
                          : 'border-slate-100 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {post.department} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </h4>
                            <p className="text-[10px] text-slate-500">{post.author}</p>
                          </div>
                        </div>
                        
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${getStatusColorStyle(post.status)}`}>
                          {post.status}
                        </span>
                      </div>

                      <div className="pl-12">
                        <h3 className="font-bold text-slate-900 text-sm mb-1">{post.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">{post.description}</p>
                        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.time}</span>
                          <button onClick={(e) => handleUpvote(post.id, e)} className="flex items-center gap-1.5 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 px-3 py-1.5 rounded-lg transition font-bold border border-slate-200">
                            <ThumbsUp className="w-3.5 h-3.5" /> {post.upvotes} Upvotes
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ---- MY COMPLAINTS TAB VIEW ---- */}
          {activeTab === 'private' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-rose-600" /> Private Complaint Tracker
                </h3>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setPrivateStatusFilter('Filed'); setSelectedPost(null); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                      privateStatusFilter === 'Filed' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Filed
                  </button>
                  <button 
                    onClick={() => { setPrivateStatusFilter('In Progress'); setSelectedPost(null); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                      privateStatusFilter === 'In Progress' 
                        ? 'bg-amber-50 text-amber-800 border-amber-300' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => { setPrivateStatusFilter('Resolved'); setSelectedPost(null); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                      privateStatusFilter === 'Resolved' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs">
                  No complaints found for status: <span className="font-bold">{privateStatusFilter}</span>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const isSelected = selectedPost?.id === post.id;
                  return (
                    <div 
                      key={post.id} 
                      onClick={() => setSelectedPost(post)} 
                      className={`p-5 rounded-2xl border bg-white transition cursor-pointer space-y-3 ${
                        isSelected 
                          ? getSelectedBorderStyle(post.status) 
                          : 'border-slate-100 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-rose-500" />
                          <h3 className="font-bold text-slate-900 text-sm">{post.title}</h3>
                        </div>
                        
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusColorStyle(post.status)}`}>
                          {post.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pl-6">{post.description}</p>
                      
                      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pl-6 pt-2">
                        <span>Department: <strong className="text-slate-800">{post.department}</strong></span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </main>

        {/* COLUMN 3: RIGHT SIDEBAR DASHBOARD */}
        <aside className="lg:col-span-3">
          {activeTab === 'feed' ? (
            selectedPost ? (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Issue Details
                  </span>
                  <button onClick={() => setSelectedPost(null)} className="bg-slate-100 p-1 rounded-full text-slate-400 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
                </div>
                <div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wide inline-block mb-2 ${getStatusColorStyle(selectedPost.status)}`}>
                    {selectedPost.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedPost.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedPost.description}</p>
                  
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Department:</span>
                      <strong className="text-slate-800">{selectedPost.department}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Reported By:</span>
                      <strong className="text-slate-800">{selectedPost.author}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Total Upvotes:</span>
                      <strong className="text-teal-700">{selectedPost.upvotes}</strong>
                    </div>
                  </div>

                  {selectedPost.mediaUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden bg-slate-100 max-h-48 border border-slate-200">
                      {selectedPost.mediaType === 'video' ? <video src={selectedPost.mediaUrl} controls className="w-full max-h-48 object-cover" /> : <img src={selectedPost.mediaUrl} alt="Attached" className="w-full max-h-48 object-cover" />}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-800">Community Discussion</h4>
                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    selectedPost.comments.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px]">
                        <span className="font-bold text-slate-800 block mb-0.5">{c.author}</span>
                        <p className="text-slate-600">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No comments yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button type="submit" className="bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-900 transition">Post</button>
                </form>
              </div>
            ) : (
              <div className="h-full"></div>
            )
          ) : activeTab === 'home' ? (
            <div className="space-y-4 sticky top-24">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Issues Near You</span>
                </div>

                <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] opacity-60"></div>
                  
                  <svg className="absolute inset-0 w-full h-full stroke-slate-200" strokeWidth="2" fill="none">
                    <line x1="0" y1="40" x2="100%" y2="80" />
                    <line x1="30%" y1="0" x2="60%" y2="100%" />
                    <line x1="0" y1="140" x2="100%" y2="110" />
                  </svg>

                  <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                  </div>

                  <div className="absolute top-6 left-12 p-1 bg-amber-500 text-white rounded-full shadow-xs transform -translate-x-1/2 -translate-y-1/2">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div className="absolute top-10 right-14 p-1 bg-rose-500 text-white rounded-full shadow-xs">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div className="absolute bottom-12 left-20 p-1 bg-emerald-500 text-white rounded-full shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="absolute top-24 left-8 p-1 bg-emerald-500 text-white rounded-full shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="absolute bottom-6 right-20 p-1 bg-amber-500 text-white rounded-full shadow-xs">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div className="absolute bottom-16 right-8 p-1 bg-emerald-500 text-white rounded-full shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>

                  <div className="absolute bottom-16 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-600 border border-blue-100 shadow-xs">
                    Your Location
                  </div>

                  <div className="absolute bottom-2 right-2 bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col divide-y divide-slate-100 text-slate-600 text-xs font-bold">
                    <button className="px-2 py-1 hover:bg-slate-50">+</button>
                    <button className="px-2 py-1 hover:bg-slate-50">-</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-teal-600" /> Filter by Status
                  </span>
                  <button 
                    onClick={() => setStatusFilter('All')} 
                    className="text-[10px] text-teal-600 font-bold hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <button 
                    onClick={() => setStatusFilter('All')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      statusFilter === 'All' 
                        ? 'bg-teal-50/70 border border-teal-200 text-teal-900 font-bold' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      <span>All</span>
                    </div>
                    <span className="bg-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">24</span>
                  </button>

                  <button 
                    onClick={() => setStatusFilter('Open')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      statusFilter === 'Open' 
                        ? 'bg-rose-50 border border-rose-200 text-rose-900 font-bold' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <span>Open</span>
                    </div>
                    <span className="bg-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">6</span>
                  </button>

                  <button 
                    onClick={() => setStatusFilter('Under Review')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      statusFilter === 'Under Review' 
                        ? 'bg-amber-50 border border-amber-200 text-amber-900 font-bold' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span>Under Review</span>
                    </div>
                    <span className="bg-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">8</span>
                  </button>

                  <button 
                    onClick={() => setStatusFilter('Resolved')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      statusFilter === 'Resolved' 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span>Resolved</span>
                    </div>
                    <span className="bg-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">10</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" /> Filter by Distance
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Within 1 km', '1 - 3 km', '3 - 5 km', 'More than 5 km'].map(dist => (
                    <button
                      key={dist}
                      onClick={() => setDistanceFilter(dist)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition ${
                        distanceFilter === dist 
                          ? 'bg-teal-50 text-teal-800 border-teal-300' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#EEF8F6] p-4 rounded-2xl border border-teal-100 space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Report responsibly</span>
                </div>
                <p className="text-[10px] text-teal-700 leading-relaxed">
                  Make sure the issue is genuine and relevant to your area. False reports can lead to penalties.
                </p>
                <a href="#learn" className="text-[10px] font-bold text-teal-600 hover:underline inline-flex items-center gap-0.5">
                  Learn more →
                </a>
              </div>

            </div>
          ) : activeTab === 'private' ? (
            selectedPost ? (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-500" /> Complaint Timeline
                  </span>
                  <button onClick={() => setSelectedPost(null)} className="bg-slate-100 p-1 rounded-full text-slate-400 hover:text-slate-600 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wide inline-block mb-2 ${getStatusColorStyle(selectedPost.status)}`}>
                    {selectedPost.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedPost.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedPost.description}</p>
                  
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Department:</span>
                      <strong className="text-slate-800">{selectedPost.department}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Reference No:</span>
                      <strong className="text-slate-800">#LP-{(selectedPost.id || 101) * 184}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-4">Stage & Timeline</h4>
                  
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(selectedPost.timeline || [
                      { name: 'Filed', title: 'Complaint Filed', time: selectedPost.time, details: 'Ticket received and queued.', completed: true },
                      { name: 'In Progress', title: 'In Progress', time: 'Under Review', details: 'Assigned to department team.', completed: selectedPost.status !== 'Filed' },
                      { name: 'Resolved', title: 'Resolved', time: 'Pending', details: 'Final resolution and audit.', completed: selectedPost.status === 'Resolved' }
                    ]).map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${getTimelineStepStyle(step.name || step.title, step.completed)}`}>
                          {step.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-2.5 h-2.5" />}
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.title}
                            </h5>
                            <span className="text-[9px] text-slate-400 font-medium">{step.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full"></div>
            )
          ) : selectedPost ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-teal-700">{selectedPost.isOfficial ? 'Notice Details' : 'Thread Details'}</span>
                <button onClick={() => setSelectedPost(null)} className="bg-slate-100 p-1 rounded-full text-slate-400 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedPost.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedPost.description}</p>
                {selectedPost.mediaUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden bg-slate-100 max-h-48 border border-slate-200">
                    {selectedPost.mediaType === 'video' ? <video src={selectedPost.mediaUrl} controls className="w-full max-h-48 object-cover" /> : <img src={selectedPost.mediaUrl} alt="Attached" className="w-full max-h-48 object-cover" />}
                  </div>
                )}
              </div>
              {!selectedPost.isOfficial && (
                <form onSubmit={handleAddComment} className="flex gap-2 pt-3 border-t border-slate-100">
                  <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500" />
                  <button type="submit" className="bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-900 transition">Post</button>
                </form>
              )}
            </div>
          ) : activeTab === 'announcements' ? (
            <div className="space-y-6 sticky top-24">
               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                 <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
                   <Building2 className="w-4 h-4 text-slate-700" /> Quick Departments
                 </h3>
                 <p className="text-[10px] text-slate-500 mb-5">Get updates directly from official sources.</p>
                 
                 <div className="space-y-1">
                   {[
                     { name: 'BESCOM', desc: 'Power supply & electricity', icon: Zap, color: 'bg-blue-100 text-blue-600' },
                     { name: 'BWSSB', desc: 'Water supply & sewage', icon: Waves, color: 'bg-cyan-100 text-cyan-600' },
                     { name: 'BBMP', desc: 'Civic services & waste management', icon: Building2, color: 'bg-emerald-100 text-emerald-600' },
                     { name: 'Health Department', desc: 'Public health & hospitals', icon: ShieldCheck, color: 'bg-teal-100 text-teal-600' },
                     { name: 'Transport Department', desc: 'Roads & public transport', icon: MapPin, color: 'bg-indigo-100 text-indigo-600' }
                   ].map((dept, idx) => (
                     <div key={idx} onClick={() => setSelectedChannel(dept.name.split(' ')[0])} className="flex items-center justify-between cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition">
                        <div className="flex items-center gap-3">
                          <div className={`${dept.color} p-2 rounded-full`}><dept.icon className="w-3.5 h-3.5"/></div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">{dept.name}</h4>
                            <p className="text-[9px] text-slate-500">{dept.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-[#EEF8F6] p-6 rounded-2xl border border-teal-100 relative overflow-hidden">
                  <ShieldCheck className="w-6 h-6 text-teal-600 mb-3 relative z-10" />
                  <h4 className="text-sm font-bold text-teal-900 mb-1.5 relative z-10">Verified Information</h4>
                  <p className="text-[10px] text-teal-700 leading-relaxed relative z-10 pr-4">All updates are published by official government departments and verified sources.</p>
               </div>
            </div>
          ) : (
            <div className="h-full"></div>
          )}
        </aside>

      </div>

      {/* LOGIN / PROFILE MODAL */}
      {isLoginOpen && (
        <LoginModalComponent 
          onLoginSuccess={handleLoginSuccess} 
          onLogout={handleLogout}
          onClose={() => setIsLoginOpen(false)} 
          initialUser={user} 
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* REPORT ISSUE MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-600" /> {user.role !== 'resident' ? 'Post Official Broadcast' : 'Report an Issue'}</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="bg-slate-100 p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-2 text-xs">Visibility Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setNewPost({ ...newPost, isPrivate: false })} className={`p-4 rounded-xl border text-left transition flex flex-col gap-1.5 ${!newPost.isPrivate ? 'border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                    <div className="flex items-center gap-2 font-bold"><Globe className={`w-4 h-4 ${!newPost.isPrivate ? 'text-teal-600' : 'text-slate-400'}`} /> Public Post</div>
                    <p className="text-[10px] text-slate-500 font-medium">Visible to neighbors. Can be upvoted.</p>
                  </button>
                  <button type="button" onClick={() => setNewPost({ ...newPost, isPrivate: true })} className={`p-4 rounded-xl border text-left transition flex flex-col gap-1.5 ${newPost.isPrivate ? 'border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                    <div className="flex items-center gap-2 font-bold"><Lock className={`w-4 h-4 ${newPost.isPrivate ? 'text-rose-600' : 'text-slate-400'}`} /> Private Complaint</div>
                    <p className="text-[10px] text-slate-500 font-medium">Sent securely to department authorities.</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Target Department</label>
                <select value={newPost.department} onChange={(e) => setNewPost({ ...newPost, department: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700">
                  <option value="BESCOM">BESCOM (Electricity & Power)</option>
                  <option value="BWSSB">BWSSB (Water Supply & Drainage)</option>
                  <option value="BBMP Roads">BBMP Roads & Infrastructure</option>
                  <option value="BBMP Sanitation">BBMP Solid Waste Management</option>
                  <option value="Ward Corporator">Ward Corporator Office</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Issue Title</label>
                <input type="text" placeholder="Short description of the problem..." value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400" />
              </div>

              <div className="space-y-3 pt-2">
                <label className="font-semibold text-slate-700 block text-xs">Evidence (Photo/Video)</label>
                <div className="flex items-center gap-3">
                  <input type="file" id="fileInput" accept="image/*,video/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) setNewPost({ ...newPost, mediaUrl: URL.createObjectURL(file), mediaType: file.type.startsWith('video') ? 'video' : 'image' }); }} />
                  <button type="button" onClick={startCamera} className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-xl border border-teal-200 flex items-center justify-center transition gap-2 text-xs font-semibold"><Camera className="w-4 h-4" /> Take Photo</button>
                  <label htmlFor="fileInput" className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 flex items-center justify-center transition gap-2 text-xs font-semibold"><ImageIcon className="w-4 h-4" /> Upload File</label>
                </div>
                {newPost.mediaUrl && (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 inline-block">
                    {newPost.mediaType === 'video' ? <video src={newPost.mediaUrl} controls className="h-24 object-cover" /> : <img src={newPost.mediaUrl} alt="Preview" className="h-24 object-cover" />}
                    <button type="button" onClick={() => setNewPost({ ...newPost, mediaUrl: '' })} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full shadow hover:bg-rose-600"><X className="w-3 h-3" /></button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Detailed Description</label>
                <textarea rows={3} placeholder="Provide landmarks, exact address, or context..." value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-200">
                  {newPost.isPrivate ? 'Submit Secure Complaint' : 'Publish to Ward Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE WEBCAM CAMERA MODAL */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Camera className="w-4 h-4 text-teal-600" /> Camera</h3>
              <button onClick={stopCamera} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <video id="webcam-preview" autoPlay playsInline ref={(ref) => { if (ref && videoStream) ref.srcObject = videoStream; }} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button type="button" onClick={capturePhoto} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition flex items-center gap-2 shadow-lg"><Camera className="w-4 h-4" /> Snap Photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MULTI-ROLE LOGIN & PROFILE MODAL COMPONENT ---
function LoginModalComponent({ onLoginSuccess, onLogout, onClose, initialUser, isLoggedIn }) {
  const [role, setRole] = useState(initialUser?.role || 'resident'); 
  const [department, setDepartment] = useState(initialUser?.department || 'BESCOM (Electricity & Power)');
  const [fullName, setFullName] = useState(initialUser?.name !== 'Guest User' ? initialUser?.name || '' : '');
  const [rawPhone, setRawPhone] = useState(initialUser?.phone ? initialUser.phone.replace(/\D/g, '').slice(-10) : '');
  
  // Location & Address Mode
  const [locationMode, setLocationMode] = useState('manual');
  const [isLocating, setIsLocating] = useState(false);
  const [manualAddress, setManualAddress] = useState({ 
    pincode: initialUser?.pincode || '', 
    area: initialUser?.address !== 'Select Ward Location' ? initialUser?.address || '' : '', 
    wardName: initialUser?.ward !== 'Local Ward' ? initialUser?.ward || '' : '', 
    fullAddress: initialUser?.fullAddress || '' 
  });

  // OTP Authentication State
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  const handlePhoneChange = (e) => {
    const inputDigitsOnly = e.target.value.replace(/\D/g, '');
    if (inputDigitsOnly.length <= 10) setRawPhone(inputDigitsOnly);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            const addr = data.address;
            const pincode = addr.postcode || '560057';
            const areaName = addr.suburb || addr.neighbourhood || addr.residential || 'Bengaluru Area';
            const wardName = addr.city_district || addr.subdistrict || 'Dasarahalli Ward';

            setManualAddress({
              pincode,
              area: areaName,
              wardName,
              fullAddress: data.display_name || `${areaName}, ${pincode}`
            });
            setLocationMode('current');
          }
        } catch (err) {
          alert("Could not fetch location details. Please fill in details manually.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Location access denied. Please enter address manually.");
        setIsLocating(false);
      }
    );
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (rawPhone.length !== 10) return alert("Please enter a valid 10-digit mobile number.");
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpNotice(`Demo OTP sent to +91 ${rawPhone}: ${code}`);
    setOtpStep(true);
  };

  const getDesignation = () => {
    if (role === 'resident') return 'Resident';
    if (role === 'dept_staff') return `Field Staff (${department.split(' ')[0]})`;
    if (role === 'dept_head') return `Department Head (${department.split(' ')[0]})`;
    if (role === 'corporator') return 'Ward Corporator';
    return 'Official';
  };

  const handleVerifyAndLogin = (e) => {
    e.preventDefault();
    if (otpInput !== generatedOtp && otpInput !== '123456') {
      return alert("Invalid OTP code. Please try again.");
    }

    onLoginSuccess({ 
      fullName: fullName || 'Resident User', 
      phoneNumber: `+91 ${rawPhone}`, 
      role, 
      department: department.split(' ')[0], 
      designation: getDesignation(), 
      locationType: locationMode, 
      area: manualAddress.area || 'Ward Layout', 
      ward: manualAddress.wardName || 'Dasarahalli Ward', 
      pincode: manualAddress.pincode || '560057', 
      fullAddress: manualAddress.fullAddress 
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* POST-LOGIN LOGOUT VIEW */}
        {isLoggedIn ? (
          <div>
            <div className="bg-teal-600 p-6 text-white flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {initialUser.name ? initialUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{initialUser.name}</h2>
                  <p className="text-xs text-teal-100 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> {initialUser.designation || 'Resident'}
                  </p>
                </div>
              </div>
              {onClose && (
                <button onClick={onClose} className="bg-teal-700/50 p-1.5 rounded-full text-teal-100 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Mobile Number:</span>
                  <strong className="text-slate-800">{initialUser.phone || '+91 9986XXXXXX'}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Assigned Ward:</span>
                  <strong className="text-teal-700">{initialUser.ward || 'Dasarahalli Ward'}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Pincode:</span>
                  <strong className="text-slate-800">{initialUser.pincode || '560057'}</strong>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button 
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition shadow-md shadow-rose-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of LocalPulse</span>
                </button>

                <button 
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-semibold text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PRE-LOGIN FORM VIEW */
          <div>
            <div className="bg-teal-600 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">LocalPulse Login</h2>
                <p className="text-xs text-teal-100 mt-1">Select your portal access level</p>
              </div>
              {onClose && (
                <button onClick={onClose} className="bg-teal-700/50 p-1.5 rounded-full text-teal-100 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 p-2 bg-slate-50 gap-1 border-b border-slate-100 text-xs font-semibold">
              <button type="button" onClick={() => setRole('resident')} className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${role === 'resident' ? 'bg-white text-teal-700 shadow-xs border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}><User className="w-3.5 h-3.5" /> Resident</button>
              <button type="button" onClick={() => setRole('dept_staff')} className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${role === 'dept_staff' ? 'bg-white text-teal-700 shadow-xs border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}><Briefcase className="w-3.5 h-3.5" /> Dept Staff</button>
              <button type="button" onClick={() => setRole('dept_head')} className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${role === 'dept_head' ? 'bg-white text-teal-700 shadow-xs border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}><ShieldCheck className="w-3.5 h-3.5" /> Dept Head</button>
              <button type="button" onClick={() => setRole('corporator')} className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${role === 'corporator' ? 'bg-white text-teal-700 shadow-xs border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}><UserCheck className="w-3.5 h-3.5" /> Corporator</button>
            </div>

            {otpNotice && (
              <div className="bg-amber-50 border-b border-amber-200 p-3 text-[11px] font-bold text-amber-900 flex justify-between items-center animate-pulse">
                <span className="flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-amber-600" /> {otpNotice}</span>
                <button onClick={() => setOtpNotice('')} className="text-amber-500 hover:text-amber-700"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="p-6 space-y-4 text-xs">
                {role !== 'resident' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Select Department</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-teal-500 outline-none">
                      <option value="BESCOM (Electricity & Power)">BESCOM (Electricity)</option>
                      <option value="BWSSB (Water Supply & Drainage)">BWSSB (Water)</option>
                      <option value="BBMP Roads & Infrastructure">BBMP Roads</option>
                      <option value="BBMP Sanitation">BBMP Solid Waste Management</option>
                      <option value="Ward Corporator Office">Ward Corporator</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">{role === 'resident' ? 'Full Name' : 'Official Name'}</label>
                  <input type="text" required placeholder={role === 'resident' ? 'E.g. Resident' : 'Officer Name'} value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 bg-slate-50">
                    <span className="bg-slate-100 text-slate-500 px-4 py-2.5 font-bold border-r border-slate-200 select-none">+91</span>
                    <input type="tel" required placeholder="9986XXXXXX" value={rawPhone} onChange={handlePhoneChange} maxLength={10} className="w-full px-4 py-2.5 focus:outline-none bg-transparent font-medium tracking-wider text-slate-800" />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block font-semibold text-slate-700 mb-1.5">Address & Location Access</label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => { setLocationMode('manual'); }}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                        locationMode === 'manual' 
                          ? 'border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <PenSquare className="w-3.5 h-3.5" /> Manual Address
                    </button>

                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                        locationMode === 'current' 
                          ? 'border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> : <Navigation className="w-3.5 h-3.5 text-teal-600" />}
                      <span>Use Location</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Pincode</label>
                      <input type="text" placeholder="560057" value={manualAddress.pincode} onChange={(e) => setManualAddress({ ...manualAddress, pincode: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Ward Name</label>
                      <input type="text" placeholder="Dasarahalli Ward" value={manualAddress.wardName} onChange={(e) => setManualAddress({ ...manualAddress, wardName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={rawPhone.length !== 10} className={`w-full py-3.5 mt-2 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${rawPhone.length === 10 ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndLogin} className="p-6 space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-600">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Enter Verification Code</h3>
                  <p className="text-[11px] text-slate-500">OTP code sent to <strong className="text-slate-800">+91 {rawPhone}</strong></p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 text-center">6-Digit OTP</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6} 
                    placeholder="123456" 
                    value={otpInput} 
                    onChange={(e) => setOtpInput(e.target.value)} 
                    className="w-full text-center tracking-[0.5em] font-bold text-lg px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-teal-500 outline-none" 
                  />
                </div>

                <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition shadow-md">
                  Verify OTP & Authenticate
                </button>

                <button type="button" onClick={() => setOtpStep(false)} className="w-full text-center text-xs text-slate-500 font-semibold hover:underline pt-1">
                  ← Change Mobile Number
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}