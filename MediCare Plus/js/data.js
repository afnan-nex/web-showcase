/**
 * MediCare Plus - Central Medical Data Store (Production Grade)
 * Contains verified clinical datasets for doctors, services, departments,
 * clinics, health resources, and demo patient records.
 */

const MEDICAL_DATA = {
  hospitalInfo: {
    name: "MediCare Plus Hospital & Specialty Clinics",
    tagline: "Excellence in Clinical Medicine, Compassionate Patient Care",
    emergencyPhone: "+1 (800) 555-0911",
    generalPhone: "+1 (800) 555-0199",
    appointmentPhone: "+1 (800) 555-0144",
    email: "care@medicareplus.org",
    mainAddress: "450 Medical Center Boulevard, Suite 100, Boston, MA 02115",
    operatingHours: {
      emergency: "24 Hours / 7 Days a Week (Level 1 Trauma Center)",
      outpatient: "Monday – Friday: 7:30 AM – 8:00 PM | Saturday: 8:00 AM – 4:00 PM | Sunday: 9:00 AM – 2:00 PM",
      laboratories: "Monday – Saturday: 6:30 AM – 7:00 PM (Walk-in blood draws available)",
      radiology: "24/7 for Inpatient & Emergency | Outpatient: Mon–Sat 7:00 AM – 8:00 PM"
    },
    accreditations: [
      { name: "Joint Commission International (JCI)", code: "Gold Seal of Approval for Hospital Quality" },
      { name: "American Hospital Association", code: "Distinguished Institutional Member" },
      { name: "Magnet Recognition for Nursing Excellence", code: "ANCC Certified Program" },
      { name: "College of American Pathologists (CAP)", code: "Accredited Central Pathology Laboratories" }
    ]
  },

  locations: [
    {
      id: "loc-main",
      name: "MediCare Plus Main Medical Center",
      type: "Tertiary Hospital & Level 1 Trauma Center",
      address: "450 Medical Center Boulevard, Boston, MA 02115",
      phone: "+1 (800) 555-0100",
      hours: "24/7 Emergency & Inpatient | Outpatient: 07:30 - 20:00",
      departments: ["Emergency Medicine", "Cardiology", "Neurology", "Orthopedics", "Oncology", "Surgery", "Intensive Care Unit (ICU)"],
      parking: "Valet parking at Main Entrance. 6-level multi-story underground visitor garage (validated for patients).",
      publicTransit: "MBTA Green Line 'E' Branch to Longwood Medical Area; Bus routes 39, 66, CT2, CT3."
    },
    {
      id: "loc-west",
      name: "MediCare Plus Westside Specialty Pavilion",
      type: "Ambulatory Surgical & Outpatient Specialty Center",
      address: "128 Beacon Ridge Way, Cambridge, MA 02138",
      phone: "+1 (800) 555-0102",
      hours: "Monday – Friday: 08:00 - 18:00 | Saturday: 08:00 - 13:00",
      departments: ["Dermatology", "Pediatrics", "Ophthalmology", "Physical Therapy & Rehabilitation", "Otolaryngology (ENT)"],
      parking: "Surface patient parking adjacent to main lobby with designated handicap bays.",
      publicTransit: "Red Line to Harvard Station; transfer to Route 72 or 75 Bus."
    },
    {
      id: "loc-north",
      name: "MediCare Plus North Suburban Diagnostic & Wellness",
      type: "Diagnostic Imaging, Primary Care & Wellness Center",
      address: "88 Executive Parkway, Suite 200, Woburn, MA 01801",
      phone: "+1 (800) 555-0103",
      hours: "Monday – Friday: 07:30 - 19:00 | Saturday: 08:00 - 16:00",
      departments: ["Internal Medicine", "Family Medicine", "Preventative Health", "Cardiovascular Diagnostics", "MRI & CT Suite"],
      parking: "Free open surface visitor parking with 8 Level-2 EV charging stations.",
      publicTransit: "Lowell Commuter Rail Line to Mishawum Station; shuttle service available."
    }
  ],

  departments: [
    {
      id: "cardiology",
      name: "Cardiovascular Medicine & Interventions",
      shortName: "Cardiology",
      icon: "heart-pulse",
      headOfDept: "Dr. Sarah Jenkins, MD, FACC, FSCAI",
      description: "Dedicated to comprehensive cardiovascular diagnostics, interventional catheterization, electrophysiology rhythm management, and heart failure therapies.",
      leadTimes: "Urgent outpatient consults within 48 hours | 24/7 Primary STEMI Cath Lab",
      featuredServices: ["Diagnostic Coronary Angiography", "Echocardiography (2D & 3D Doppler)", "Cardiac Electrophysiology & Pacemaker Implantation", "Preventive Lipidology & Arterial Health Clinic"]
    },
    {
      id: "neurology",
      name: "Neurology & Comprehensive Stroke Center",
      shortName: "Neurology",
      icon: "brain",
      headOfDept: "Dr. Marcus Vance, MD, PhD, FAAN",
      description: "Specialized clinical diagnosis and management of central and peripheral nervous system conditions, cerebrovascular disease, neuromuscular disorders, and epilepsy.",
      leadTimes: "Comprehensive Stroke Center with rapid neuro-interventional triage 24/7",
      featuredServices: ["Acute Ischemic Stroke Revascularization", "Comprehensive Epilepsy Monitoring Unit (EMU)", "Movement Disorders & Deep Brain Stimulation Follow-up", "Headache & Refractory Migraine Center"]
    },
    {
      id: "orthopedics",
      name: "Orthopedic Surgery & Sports Medicine",
      shortName: "Orthopedics",
      icon: "bone",
      headOfDept: "Dr. Elena Rostova, MD, FAAOS",
      description: "Restoring musculoskeletal function and joint mobility through computer-navigated robotic arthroplasty, arthroscopic repair, fracture care, and spine reconstruction.",
      leadTimes: "Urgent Orthopedic & Fracture Walk-In: Monday–Friday 08:00–16:00",
      featuredServices: ["Robotic Mako-Assisted Total Knee & Hip Replacement", "Shoulder & Knee Arthroscopic Reconstruction", "Minimally Invasive Spine Decompression", "Post-Surgical Musculoskeletal Physical Therapy"]
    },
    {
      id: "oncology",
      name: "Medical & Surgical Oncology",
      shortName: "Oncology",
      icon: "activity",
      headOfDept: "Dr. Robert Chen, MD, PhD, FASCO",
      description: "Multidisciplinary cancer care integrating targeted immunotherapy biologics, next-generation genomic tumor profiling, outpatient infusion suites, and clinical trials.",
      leadTimes: "New oncology consultations scheduled within 72 business hours",
      featuredServices: ["Precision Molecular Profiling & Targeted Biologics", "Outpatient Chemotherapy & Immunotherapy Infusion", "Multidisciplinary Tumor Board Review", "Cancer Survivorship & Integrative Supportive Care"]
    },
    {
      id: "pediatrics",
      name: "Pediatric & Adolescent Medicine",
      shortName: "Pediatrics",
      icon: "users",
      headOfDept: "Dr. Amara Okafor, MD, FAAP",
      description: "Comprehensive family-centered healthcare for infants, children, and adolescents, encompassing preventative developmental milestones, acute pediatrics, and adolescent medicine.",
      leadTimes: "Guaranteed same-day acute sick child triage appointments",
      featuredServices: ["Well-Child Developmental Audits & Immunizations", "Pediatric Asthma & Allergy Management", "Childhood Behavioral & Mental Health Screening", "Adolescent Sports Physicals & Nutrition"]
    },
    {
      id: "internal-medicine",
      name: "Internal & Preventive Family Medicine",
      shortName: "Internal Medicine",
      icon: "clipboard",
      headOfDept: "Dr. Jonathan Hayes, MD, FACP",
      description: "Long-term primary healthcare navigation, chronic multi-morbidity management, executive preventative health physicals, and adult health maintenance.",
      leadTimes: "New patient primary care appointments available this week",
      featuredServices: ["Comprehensive Annual Preventative Physicals", "Type 1 & Type 2 Diabetes Management Protocols", "Hypertension & Cardiovascular Risk Stratification", "Geriatric Multi-Disciplinary Health Navigation"]
    },
    {
      id: "dermatology",
      name: "Dermatology & Cutaneous Oncology",
      shortName: "Dermatology",
      icon: "sun",
      headOfDept: "Dr. Rachel Sterling, MD, FAAD",
      description: "Clinical diagnosis and surgical treatment of dermatologic conditions, full-body digital dermoscopy for melanoma screening, and Mohs micrographic skin cancer surgery.",
      leadTimes: "Urgent biopsy evaluation and mole triage within 48 hours",
      featuredServices: ["Full-Body High-Resolution Digital Dermoscopy", "Mohs Micrographic Surgery for Cutaneous Carcinomas", "Severe Psoriasis, Eczema & Biologic Therapy", "Phototherapy & Laser Cutaneous Procedures"]
    },
    {
      id: "radiology",
      name: "Diagnostic Radiology & Molecular Imaging",
      shortName: "Radiology",
      icon: "cpu",
      headOfDept: "Dr. David Thorne, MD, FACR",
      description: "Sub-specialized radiological interpretations utilizing state-of-the-art 3T wide-bore MRI, 128-slice dual-source CT angiography, and 3D digital breast tomosynthesis.",
      leadTimes: "Same-day diagnostic scans with board-certified report delivery within 24 hours",
      featuredServices: ["High-Field 3T Multi-Parametric MRI", "Ultra-Low-Dose CT Angiography", "3D Digital Mammography Screening", "Ultrasound-Guided Interventional Biopsies"]
    }
  ],

  doctors: [
    {
      id: "doc-sarah-jenkins",
      name: "Dr. Sarah Jenkins",
      title: "MD, FACC, FSCAI",
      role: "Chief of Cardiovascular Medicine",
      departmentId: "cardiology",
      departmentName: "Cardiovascular Medicine & Interventions",
      specialty: "Interventional Cardiology & Coronary Artery Disease",
      subSpecialties: ["Complex Percutaneous Coronary Interventions", "Transcatheter Aortic Valve Replacement (TAVR)", "Preventive Cardiometabolic Medicine"],
      experienceYears: 18,
      gender: "Female",
      languages: ["English", "Spanish"],
      locations: ["MediCare Plus Main Medical Center"],
      consultationTypes: ["In-Person", "Video Consultation"],
      consultationFee: 280,
      rating: 4.95,
      reviewCount: 142,
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Sarah Jenkins is an internationally recognized interventional cardiologist with over 18 years of clinical and academic leadership. She specializes in minimally invasive catheter interventions, ischemic heart disease, and lipid optimization.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Harvard Medical School", year: "2005" },
        { degree: "Residency in Internal Medicine", institution: "Massachusetts General Hospital", year: "2008" },
        { degree: "Fellowship in Cardiovascular Disease", institution: "Brigham and Women's Hospital", year: "2011" },
        { degree: "Interventional Cardiology Sub-Fellowship", institution: "Johns Hopkins Hospital", year: "2012" }
      ],
      certifications: [
        "American Board of Internal Medicine - Cardiovascular Disease (Board Certified)",
        "American Board of Internal Medicine - Interventional Cardiology (Board Certified)",
        "Fellow of the American College of Cardiology (FACC)",
        "Fellow of the Society for Cardiovascular Angiography and Interventions (FSCAI)"
      ],
      workingHours: {
        monday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00"],
        tuesday: ["08:30", "09:30", "10:30", "14:00", "15:00"],
        wednesday: ["10:00", "11:00", "13:30", "14:30", "15:30", "16:30"],
        thursday: ["08:30", "09:30", "10:30", "11:30", "14:00"],
        friday: ["09:00", "10:00", "11:00", "13:00", "14:00"]
      },
      nextAvailable: "Today",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "UnitedHealthcare", "Cigna Healthcare", "Humana", "Mass General Brigham Health Plan"],
      awards: ["Top Doctors in Cardiology (2022-2025)", "AHA Clinical Excellence Award in Coronary Care", "Distinguished Faculty Teaching Award"],
      reviews: [
        { patientName: "Arthur P.", date: "2026-07-14", rating: 5, comment: "Dr. Jenkins explained my coronary catheterization with remarkable clarity, technical rigor, and genuine empathy. The post-procedure recovery protocol was flawless." },
        { patientName: "Maria L.", date: "2026-06-28", rating: 5, comment: "Her thoroughness and calm clinical manner alleviated all my anxiety regarding my stent follow-up. Excellent clinical care team as well." },
        { patientName: "David K.", date: "2026-05-19", rating: 4.8, comment: "Extremely skilled cardiologist. Wait time was under 8 minutes and the consultation was detailed, rigorous, and unhurried." }
      ]
    },
    {
      id: "doc-marcus-vance",
      name: "Dr. Marcus Vance",
      title: "MD, PhD, FAAN",
      role: "Director of Stroke & Cerebrovascular Neurology",
      departmentId: "neurology",
      departmentName: "Neurology & Comprehensive Stroke Center",
      specialty: "Clinical Neurology & Stroke Rehabilitation",
      subSpecialties: ["Acute Ischemic & Hemorrhagic Stroke", "Cerebral Vascular Malformations", "Refractory Migraine & Neuro-Vascular Disorders"],
      experienceYears: 15,
      gender: "Male",
      languages: ["English", "German"],
      locations: ["MediCare Plus Main Medical Center"],
      consultationTypes: ["In-Person", "Video Consultation"],
      consultationFee: 310,
      rating: 4.92,
      reviewCount: 98,
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Marcus Vance combines rigorous neuroscience clinical research with bedside clinical diagnostic acumen. He oversees our Comprehensive Stroke Center and leads advanced clinical trials in acute neuroprotection and migraine therapeutics.",
      education: [
        { degree: "MD / PhD in Cellular Neurobiology", institution: "Yale School of Medicine", year: "2008" },
        { degree: "Neurology Residency", institution: "Columbia University Irving Medical Center", year: "2012" },
        { degree: "Fellowship in Vascular Neurology", institution: "UCSF Medical Center", year: "2014" }
      ],
      certifications: [
        "American Board of Psychiatry and Neurology - Vascular Neurology (Board Certified)",
        "American Society of Neuroimaging Neurosonology Certification",
        "Fellow of the American Academy of Neurology (FAAN)"
      ],
      workingHours: {
        monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
        tuesday: ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30"],
        thursday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00"],
        friday: ["09:00", "10:00", "11:00", "13:00"]
      },
      nextAvailable: "Tomorrow",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "Cigna Healthcare", "Mass General Brigham Health Plan", "UnitedHealthcare"],
      awards: ["NIH Clinical Neuroscience Research Fellowship", "American Neurological Association Scholar Award"],
      reviews: [
        { patientName: "Helena S.", date: "2026-08-02", rating: 5, comment: "Dr. Vance identified a subtle neurological root cause that multiple specialists missed. My chronic hemiplegic migraines are now fully manageable." },
        { patientName: "George W.", date: "2026-06-11", rating: 4.9, comment: "Deeply knowledgeable, exceptionally attentive, and methodical in prescribing neuromodulatory therapies." }
      ]
    },
    {
      id: "doc-elena-rostova",
      name: "Dr. Elena Rostova",
      title: "MD, FAAOS",
      role: "Lead Orthopedic Joint Reconstruction Surgeon",
      departmentId: "orthopedics",
      departmentName: "Orthopedic Surgery & Sports Medicine",
      specialty: "Adult Hip & Knee Reconstruction",
      subSpecialties: ["Robotic-Assisted Total Hip Arthroplasty", "Minimally Invasive Subvastus Knee Replacement", "Complex Revision Joint Arthroplasty"],
      experienceYears: 16,
      gender: "Female",
      languages: ["English", "Russian", "French"],
      locations: ["MediCare Plus Main Medical Center", "MediCare Plus Westside Specialty Pavilion"],
      consultationTypes: ["In-Person"],
      consultationFee: 290,
      rating: 4.98,
      reviewCount: 185,
      photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Elena Rostova is a pioneer in computer-assisted and robotic joint replacement. She has performed over 3,200 successful hip and knee reconstructions with rapid recovery protocols allowing patients to return home safely within 24 hours.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Stanford University School of Medicine", year: "2007" },
        { degree: "Orthopedic Surgery Residency", institution: "Hospital for Special Surgery (HSS)", year: "2012" },
        { degree: "Adult Reconstruction & Joint Arthroplasty Fellowship", institution: "Mayo Clinic", year: "2013" }
      ],
      certifications: [
        "American Board of Orthopaedic Surgery - ABOS (Board Certified)",
        "Fellow of the American Academy of Orthopaedic Surgeons (FAAOS)",
        "Member of the American Association of Hip and Knee Surgeons (AAHKS)"
      ],
      workingHours: {
        tuesday: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
        wednesday: ["08:00", "09:00", "10:00", "11:00"],
        thursday: ["13:00", "14:00", "15:00", "16:00", "17:00"],
        saturday: ["09:00", "10:00", "11:00", "12:00"]
      },
      nextAvailable: "Today",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "UnitedHealthcare", "Cigna Healthcare", "Tricare Military Health"],
      awards: ["HSS Surgical Excellence in Joint Biomechanics", "Top Surgical Innovator of the Year"],
      reviews: [
        { patientName: "Robert T.", date: "2026-07-29", rating: 5, comment: "I had a total robotic knee replacement with Dr. Rostova. I was walking unassisted and pain-free within three weeks. Truly an extraordinary surgeon." },
        { patientName: "Catherine D.", date: "2026-07-04", rating: 5, comment: "Her surgical precision and post-op rehabilitation protocol are unparalleled." }
      ]
    },
    {
      id: "doc-robert-chen",
      name: "Dr. Robert Chen",
      title: "MD, PhD, FASCO",
      role: "Senior Consultant in Medical Oncology",
      departmentId: "oncology",
      departmentName: "Medical & Surgical Oncology",
      specialty: "Gastrointestinal & Thoracic Oncology",
      subSpecialties: ["Precision Immunotherapy & Checkpoint Inhibitors", "Targeted Molecular Kinase Inhibitors", "Phase I/II Cancer Clinical Trials"],
      experienceYears: 20,
      gender: "Male",
      languages: ["English", "Mandarin"],
      locations: ["MediCare Plus Main Medical Center"],
      consultationTypes: ["In-Person", "Video Consultation"],
      consultationFee: 320,
      rating: 4.96,
      reviewCount: 114,
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Robert Chen leads comprehensive oncology multidisciplinary tumor boards. His clinical work centers around biomarker-driven systemic chemotherapy, immunotherapy regimens, and clinical trial access for solid tumors.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Johns Hopkins University School of Medicine", year: "2003" },
        { degree: "PhD in Molecular Oncology & Genomics", institution: "Johns Hopkins Bloomberg", year: "2005" },
        { degree: "Hematology / Medical Oncology Fellowship", institution: "Dana-Farber Cancer Institute", year: "2009" }
      ],
      certifications: [
        "American Board of Internal Medicine - Medical Oncology (Board Certified)",
        "Fellow of the American Society of Clinical Oncology (FASCO)"
      ],
      workingHours: {
        monday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00"],
        wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        friday: ["08:30", "09:30", "10:30", "11:30", "13:30"]
      },
      nextAvailable: "This Week",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "UnitedHealthcare", "Cigna Healthcare"],
      awards: ["ASCO Conquer Cancer Foundation Investigator Award", "Distinguished Oncologist Fellowship"],
      reviews: [
        { patientName: "James N.", date: "2026-08-01", rating: 5, comment: "Dr. Chen crafted a targeted genomic immunotherapy protocol that stabilized my stage IV condition. His scientific depth and compassion gave our family unmatched confidence." },
        { patientName: "Linda M.", date: "2026-06-18", rating: 5, comment: "Empathetic, clear, and takes all the time needed to explain genomic reports and biomarker mutations." }
      ]
    },
    {
      id: "doc-amara-okafor",
      name: "Dr. Amara Okafor",
      title: "MD, FAAP",
      role: "Director of General & Adolescent Pediatrics",
      departmentId: "pediatrics",
      departmentName: "Pediatric & Adolescent Medicine",
      specialty: "Pediatric Medicine & Child Development",
      subSpecialties: ["Pediatric Asthma & Environmental Allergies", "Newborn & Infant Milestone Care", "Adolescent Behavioral Health"],
      experienceYears: 13,
      gender: "Female",
      languages: ["English", "Igbo"],
      locations: ["MediCare Plus Westside Specialty Pavilion"],
      consultationTypes: ["In-Person", "Video Consultation"],
      consultationFee: 210,
      rating: 4.97,
      reviewCount: 220,
      photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Amara Okafor provides comprehensive pediatric care with a focus on preventative wellness, developmental milestones, and acute childhood illnesses. Parents praise her warm, engaging bedside manner with young children.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "University of Pennsylvania Perelman School of Medicine", year: "2010" },
        { degree: "Pediatrics Residency", institution: "Children's Hospital of Philadelphia (CHOP)", year: "2013" }
      ],
      certifications: [
        "American Board of Pediatrics - ABP (Board Certified)",
        "Fellow of the American Academy of Pediatrics (FAAP)",
        "Pediatric Advanced Life Support (PALS) Instructor Certification"
      ],
      workingHours: {
        monday: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
        tuesday: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00"],
        thursday: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
        friday: ["08:00", "09:00", "10:00", "11:00", "12:00"],
        saturday: ["08:30", "09:30", "10:30", "11:30"]
      },
      nextAvailable: "Today",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "Medicaid / MassHealth", "UnitedHealthcare", "Cigna Healthcare", "Harvard Pilgrim"],
      awards: ["Top Pediatrician Community Leadership Award", "CHOP Clinical Resident of the Year"],
      reviews: [
        { patientName: "Samantha K. (Parent)", date: "2026-08-15", rating: 5, comment: "Dr. Okafor is wonderful with our 4-year-old. She eliminates clinic anxiety immediately and explains everything to parents with clarity." },
        { patientName: "Marcus B.", date: "2026-07-22", rating: 5, comment: "Always punctual, kind, and provides very practical action plans for childhood asthma flareups." }
      ]
    },
    {
      id: "doc-jonathan-hayes",
      name: "Dr. Jonathan Hayes",
      title: "MD, FACP",
      role: "Lead Physician & Chief Medical Officer",
      departmentId: "internal-medicine",
      departmentName: "Internal & Preventive Family Medicine",
      specialty: "Internal Medicine & Chronic Disease Management",
      subSpecialties: ["Complex Type 2 Diabetes Glycemic Control", "Essential & Secondary Hypertension", "Geriatric Multi-System Care"],
      experienceYears: 22,
      gender: "Male",
      languages: ["English"],
      locations: ["MediCare Plus Main Medical Center", "MediCare Plus North Suburban Diagnostic & Wellness"],
      consultationTypes: ["In-Person", "Video Consultation"],
      consultationFee: 240,
      rating: 4.89,
      reviewCount: 167,
      photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Jonathan Hayes has dedicated over two decades to primary adult medicine. He excels in managing complex systemic chronic conditions, coordinating multi-specialty care, and emphasizing lifestyle-based preventative medicine.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Tufts University School of Medicine", year: "2001" },
        { degree: "Internal Medicine Residency", institution: "Beth Israel Deaconess Medical Center", year: "2004" }
      ],
      certifications: [
        "American Board of Internal Medicine - ABIM (Board Certified)",
        "Fellow of the American College of Physicians (FACP)"
      ],
      workingHours: {
        monday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00"],
        tuesday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00"],
        wednesday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00"],
        thursday: ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00"],
        friday: ["08:30", "09:30", "10:30", "11:30"]
      },
      nextAvailable: "Today",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "UnitedHealthcare", "Cigna Healthcare", "Humana", "AARP Medicare Complete"],
      awards: ["Master Clinician in Internal Medicine", "Top Primary Care Physician Award 2024"],
      reviews: [
        { patientName: "William E.", date: "2026-08-10", rating: 5, comment: "Dr. Hayes has been my primary physician for 12 years. His diagnostic rigor is unmatched and he coordinates all my specialist visits seamlessly." },
        { patientName: "Evelyn T.", date: "2026-07-15", rating: 4.8, comment: "Exceptional physician communication and very prompt follow-up on laboratory reports via the portal." }
      ]
    },
    {
      id: "doc-rachel-sterling",
      name: "Dr. Rachel Sterling",
      title: "MD, FAAD",
      role: "Director of Cutaneous Oncology & Medical Dermatology",
      departmentId: "dermatology",
      departmentName: "Dermatology & Cutaneous Oncology",
      specialty: "Medical Dermatology & Skin Cancer Surgery",
      subSpecialties: ["Mohs Micrographic Surgery", "Early Melanoma Detection & Digital Body Mapping", "Biologic Therapies for Severe Psoriasis"],
      experienceYears: 14,
      gender: "Female",
      languages: ["English", "Spanish"],
      locations: ["MediCare Plus Westside Specialty Pavilion"],
      consultationTypes: ["In-Person"],
      consultationFee: 260,
      rating: 4.94,
      reviewCount: 130,
      photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. Rachel Sterling is an expert in dermato-oncology and reconstructive dermatologic surgery. She utilizes cutting-edge polarized dermoscopy to detect pre-cancerous and malignant lesions at the earliest microscopical stage.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Northwestern University Feinberg School of Medicine", year: "2009" },
        { degree: "Dermatology Residency", institution: "NYU Langone Medical Center", year: "2013" },
        { degree: "Micrographic Surgery & Dermatologic Oncology Fellowship", institution: "Cleveland Clinic", year: "2014" }
      ],
      certifications: [
        "American Board of Dermatology - ABD (Board Certified)",
        "Micrographic Dermatologic Surgery Subspecialty Board Certification",
        "Fellow of the American Academy of Dermatology (FAAD)"
      ],
      workingHours: {
        monday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
        tuesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
        thursday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
        friday: ["09:00", "10:00", "11:00", "12:00"]
      },
      nextAvailable: "Tomorrow",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "UnitedHealthcare", "Cigna Healthcare"],
      awards: ["Dermatology Foundation Research Grant", "Excellence in Reconstructive Dermatologic Surgery"],
      reviews: [
        { patientName: "Anthony G.", date: "2026-07-28", rating: 5, comment: "Dr. Sterling removed a basal cell carcinoma from my cheek with virtually invisible scarring. Truly remarkable surgical hands." },
        { patientName: "Patricia B.", date: "2026-06-30", rating: 5, comment: "Extremely thorough full-body dermoscopy exam. Gave clear preventative instructions and peaceful reassurance." }
      ]
    },
    {
      id: "doc-david-thorne",
      name: "Dr. David Thorne",
      title: "MD, FACR",
      role: "Lead Interventional & Diagnostic Radiologist",
      departmentId: "radiology",
      departmentName: "Diagnostic Radiology & Molecular Imaging",
      specialty: "Diagnostic Radiology & Musculoskeletal MRI",
      subSpecialties: ["High-Resolution 3T Joint & Spine MRI", "CT-Guided Percutaneous Biopsies", "Cardiovascular CT Angiography"],
      experienceYears: 19,
      gender: "Male",
      languages: ["English"],
      locations: ["MediCare Plus Main Medical Center", "MediCare Plus North Suburban Diagnostic & Wellness"],
      consultationTypes: ["In-Person"],
      consultationFee: 275,
      rating: 4.91,
      reviewCount: 76,
      photo: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&crop=faces&w=600&h=600&q=80",
      bio: "Dr. David Thorne specializes in advanced diagnostic cross-sectional imaging and musculoskeletal radiology. He works closely with orthopedists, neurosurgeons, and oncologists to deliver precise anatomical diagnoses.",
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "University of Michigan Medical School", year: "2004" },
        { degree: "Diagnostic Radiology Residency", institution: "University of Washington Medical Center", year: "2009" },
        { degree: "Musculoskeletal Radiology Fellowship", institution: "Miriam Hospital / Brown University", year: "2010" }
      ],
      certifications: [
        "American Board of Radiology - ABR (Board Certified)",
        "Fellow of the American College of Radiology (FACR)"
      ],
      workingHours: {
        monday: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00"],
        wednesday: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00"],
        thursday: ["08:00", "09:00", "10:00", "11:00", "13:00"],
        saturday: ["08:30", "09:30", "10:30", "11:30", "12:30"]
      },
      nextAvailable: "This Week",
      insuranceAccepted: ["Blue Cross Blue Shield", "Aetna Health", "Medicare / CMS", "UnitedHealthcare", "Cigna Healthcare", "Tricare Military Health"],
      awards: ["RSNA Roentgen Research Fellow Award", "Excellence in Diagnostic Cross-Sectional Imaging"],
      reviews: [
        { patientName: "Bernard H.", date: "2026-07-19", rating: 5, comment: "I received my detailed 3T spine MRI interpretation report within 3 hours. Outstanding clarity in the clinical summary." },
        { patientName: "Carolyn W.", date: "2026-06-05", rating: 4.8, comment: "The wide-bore MRI scan was fast, quiet, and the radiology team made me feel completely comfortable." }
      ]
    }
  ],

  services: [
    {
      id: "srv-cardio-check",
      name: "Comprehensive Cardiovascular Health Assessment",
      departmentId: "cardiology",
      departmentName: "Cardiovascular Medicine",
      duration: "60 mins",
      estimatedFee: "$350 - $650",
      description: "Complete clinical evaluation including 12-lead ECG, advanced lipid fractionation, hs-CRP, echocardiogram evaluation, and Framingham cardiovascular 10-year risk profile.",
      preparation: "Fasting for 8 hours required for lipid profile blood draw. Drink water as normal. Take regular prescription morning medications unless directed otherwise.",
      included: ["12-Lead Resting Diagnostic ECG", "Transthoracic Echocardiogram (2D & Color Doppler)", "Atherogenic Lipid Fractionation & hs-CRP Panel", "1-on-1 Consultation with Board-Certified Cardiologist", "Personalized Cardiovascular Risk Mitigation Protocol"]
    },
    {
      id: "srv-joint-ortho",
      name: "Orthopedic Mobility & Joint Preservation Clinic",
      departmentId: "orthopedics",
      departmentName: "Orthopedic Surgery & Sports Medicine",
      duration: "45 mins",
      estimatedFee: "$280 - $450",
      description: "Evaluation for osteoarthritis, ligament tears, cartilage degeneration, and chronic joint pain with weight-bearing digital radiography and physical functional assessment.",
      preparation: "Wear comfortable loose athletic clothing or shorts. Bring copies of any prior X-ray or MRI imaging discs.",
      included: ["Orthopedic Physical Functional Examination", "Digital Bilateral Weight-Bearing Radiographs (X-Ray)", "Gait & Range-of-Motion Biomechanical Analysis", "Detailed Treatment Plan: Conservative vs. Robotic Arthroplasty Options"]
    },
    {
      id: "srv-neuro-eval",
      name: "Cognitive & Neurological Diagnostic Consultation",
      departmentId: "neurology",
      departmentName: "Neurology & Stroke",
      duration: "60 mins",
      estimatedFee: "$320 - $550",
      description: "In-depth clinical neurological assessment for recurring headaches, sensory deficits, neuropathic pain, tremor, memory changes, or post-concussion symptoms.",
      preparation: "Bring an updated list of all medications and supplements. Bring any prior CT/MRI brain or spine scan reports.",
      included: ["Comprehensive Cranial Nerve & Deep Tendon Reflex Testing", "Motor, Sensory & Cerebellar Function Mapping", "Standardized Cognitive Screening (MoCA / MMSE)", "Diagnostic Imaging Review & Personalized Medication Plan"]
    },
    {
      id: "srv-exec-health",
      name: "Executive Comprehensive Health Physical",
      departmentId: "internal-medicine",
      departmentName: "Internal & Family Medicine",
      duration: "90 mins",
      estimatedFee: "$450 - $800",
      description: "Full-spectrum preventative health audit covering multi-organ function, biometric screening, cardiac baseline, early cancer detection markers, and lifestyle longevity recommendations.",
      preparation: "Fasting 10 hours required. Hydrate with plain water. Wear comfortable clothing.",
      included: ["Comprehensive Metabolic Panel (CMP-14) & Complete Blood Count", "Thyroid, Liver, Kidney & HbA1c Glycemic Panels", "Resting 12-Lead ECG & Pulmonary Spirometry", "Vaccination Audit & Early Cancer Screening Plan", "In-Depth Physician Wellness Consultation"]
    },
    {
      id: "srv-pediatric-well",
      name: "Pediatric Well-Child & Developmental Check",
      departmentId: "pediatrics",
      departmentName: "Pediatric Medicine",
      duration: "30 mins",
      estimatedFee: "$180 - $250",
      description: "Routine pediatric developmental assessment, growth curves tracking, hearing and vision screening, nutritional counseling, and CDC-recommended immunization administration.",
      preparation: "Bring child's official state immunization record card and any school or sports clearance forms.",
      included: ["WHO/CDC Growth Metric Percentiles & Milestone Audit", "Vision & Hearing Acuity Screening", "Immunization Record Review & Vaccine Administration", "Parental Nutritional & Sleep Hygiene Guidance"]
    },
    {
      id: "srv-derma-screening",
      name: "Full-Body Digital Skin Cancer Screening",
      departmentId: "dermatology",
      departmentName: "Dermatology",
      duration: "30 mins",
      estimatedFee: "$220 - $350",
      description: "Comprehensive head-to-toe dermatoscopic examination for melanoma, basal cell, squamous cell carcinoma, and dysplastic nevi using polarized high-resolution dermoscopy.",
      preparation: "Please remove heavy makeup, facial cosmetics, and dark nail polish prior to examination.",
      included: ["Complete Cutaneous Surface Dermatoscopic Exam", "High-Resolution Polarized Epiluminescence Dermoscopy", "Digital Photographic Mole Mapping for High-Risk Lesions", "Biopsy of Suspicious Cutaneous Lesions (if clinically indicated)"]
    },
    {
      id: "srv-mri-imaging",
      name: "High-Field 3T Diagnostic MRI Scan",
      departmentId: "radiology",
      departmentName: "Diagnostic Radiology & Imaging",
      duration: "45 mins",
      estimatedFee: "$400 - $950",
      description: "State-of-the-art non-invasive anatomical imaging with 3T wide-bore magnet for spine, brain, orthopedic joints, or abdominal organs with board-certified sub-specialist interpretation.",
      preparation: "Inform technician if you have pacemaker, metallic implants, or surgical clips. Remove all metal jewelry.",
      included: ["3T High-Field Multi-Parametric MRI Protocol", "Dedicated Musculoskeletal / Neuro Radiologist Interpretation", "Patient Digital Access via Portal within 24 Hours", "DICOM Image Archive Export on Secure Digital Storage"]
    },
    {
      id: "srv-cancer-second-opinion",
      name: "Multidisciplinary Oncology Second Opinion",
      departmentId: "oncology",
      departmentName: "Medical Oncology",
      duration: "60 mins",
      estimatedFee: "$350 - $600",
      description: "Comprehensive pathology, molecular profile, and treatment regimen review by our senior oncology tumor board to validate diagnosis and offer cutting-edge clinical trial options.",
      preparation: "Upload all prior biopsy pathology slides, PET-CT scan reports, and surgical operative records in advance.",
      included: ["Pathology Specimen & Biopsy Re-Evaluation", "Genomic Alterations & Biomarker Review", "Multidisciplinary Tumor Board Consensus Recommendations", "Direct Communication with Primary Treating Oncologist"]
    }
  ],

  healthArticles: [
    {
      id: "art-cardiac-prevention",
      title: "Understanding Atherosclerosis & Proactive Cardiovascular Prevention",
      category: "Cardiology",
      readTime: "5 min read",
      author: "Dr. Sarah Jenkins, MD, FACC",
      date: "August 12, 2026",
      snippet: "Cardiovascular disease remains the leading cause of mortality worldwide, yet over 80% of premature coronary events are preventable through early lipid optimization, blood pressure control, and lifestyle interventions.",
      fullContent: `Atherosclerosis is an insidious vascular process characterized by the chronic accumulation of lipid-rich fibrofatty plaques within the intima of medium and large muscular arteries.

Key Clinical Preventive Strategies:
1. Advanced Biomarker Profiling: Beyond standard total cholesterol, measuring Apolipoprotein B (ApoB), Lipoprotein(a), and high-sensitivity C-reactive protein (hs-CRP) provides far more accurate assessment of atherogenic particle burden.
2. Blood Pressure Optimization: Sustained systolic pressure above 120 mmHg damages the endothelial lining, facilitating LDL particle transcytosis into the vessel wall.
3. Lifestyle & Nutrition: A Mediterranean-style dietary pattern rich in monounsaturated fats, dietary fiber, and polyphenols, combined with 150+ minutes weekly of moderate aerobic exercise, significantly slows plaque progression.`,
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "art-joint-health",
      title: "Preserving Joint Longevity: When to Consider Minimally Invasive Arthroplasty",
      category: "Orthopedics",
      readTime: "6 min read",
      author: "Dr. Elena Rostova, MD, FAAOS",
      date: "July 28, 2026",
      snippet: "Joint stiffness and persistent cartilage wear don't mean you must give up an active lifestyle. Learn the spectrum of modern interventions from hyaluronic acid viscosupplementation to robotic-assisted partial replacements.",
      fullContent: `Osteoarthritis of the hip and knee represents progressive biomechanical cartilage loss accompanied by subchondral sclerosis and periarticular osteophyte formation.

Clinical Treatment Ladder:
1. Conservative Therapy: Targeted quadriceps and gluteal physical therapy, low-impact cross-training, and weight optimization to reduce knee joint loading forces.
2. Interventional Injections: Ultrasound-guided intra-articular hyaluronic acid viscosupplementation or corticosteroid therapy for acute inflammatory flares.
3. Robotic Joint Arthroplasty: When functional impairment severely restricts activities of daily living, robotic-guided joint replacement allows custom 3D implant positioning preserving healthy bone stock with rapid recovery within 24 hours.`,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "art-pediatric-fever",
      title: "Clinical Guide: Managing Fevers and Viral Illnesses in Young Children",
      category: "Pediatrics",
      readTime: "4 min read",
      author: "Dr. Amara Okafor, MD, FAAP",
      date: "July 15, 2026",
      snippet: "A parental reference on distinguishing benign viral temperatures from urgent medical symptoms requiring immediate pediatric evaluation, with dosage safety guidelines for antipyretics.",
      fullContent: `Fever is a natural physiological immune response to viral and bacterial infections, activating pyrogens that stimulate lymphocyte proliferation.

When to Seek Immediate Clinical Evaluation:
1. Infants Under 3 Months: Any rectal temperature >= 100.4°F (38.0°C) requires immediate physician assessment.
2. Warning Signs: Lethargy, poor oral fluid intake with decreased wet diapers, labored breathing, or persistent vomiting.
3. Medication Safety: Weight-based dosing of acetaminophen or ibuprofen should always be confirmed with your pediatrician. Never administer aspirin to children or adolescents due to the risk of Reye's syndrome.`,
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
    }
  ],

  insurancePartners: [
    { name: "Blue Cross Blue Shield", tier: "In-Network Preferred Tier 1" },
    { name: "Aetna Health", tier: "In-Network Preferred Tier 1" },
    { name: "Medicare / CMS", tier: "Participating Provider Part B" },
    { name: "UnitedHealthcare", tier: "In-Network Preferred" },
    { name: "Cigna Healthcare", tier: "In-Network Tier 1" },
    { name: "Humana", tier: "In-Network Provider" },
    { name: "Mass General Brigham Health Plan", tier: "Affiliated Regional Network" },
    { name: "Tricare Military Health", tier: "Authorized Medical Facility" }
  ],

  // Demo data for Patient Portal
  demoPatient: {
    id: "PAT-94021",
    fullName: "Eleanor Vance",
    preferredName: "Eleanor",
    dob: "1988-04-12",
    age: 38,
    gender: "Female",
    email: "eleanor.vance@example.com",
    phone: "+1 (555) 234-8901",
    bloodGroup: "A+",
    address: "74 Commonwealth Avenue, Apt 4B, Boston, MA 02116",
    emergencyContact: {
      name: "David Vance",
      relation: "Spouse",
      phone: "+1 (555) 987-6543"
    },
    primaryPhysician: "Dr. Jonathan Hayes, MD",
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-88941029-MA",
      groupNumber: "GRP-00452",
      status: "Active / Verified"
    },
    allergies: [
      { name: "Penicillin", severity: "Severe (Anaphylaxis)" },
      { name: "Sulfa Drugs", severity: "Moderate (Skin urticaria)" }
    ],
    chronicConditions: [
      "Essential Hypertension (Well Controlled)",
      "Mild Exercise-Induced Bronchospasm"
    ],
    vitals: {
      bloodPressure: "118 / 78 mmHg",
      heartRate: "68 bpm (Resting)",
      bmi: "22.4 kg/m²",
      spO2: "99%",
      respiratoryRate: "14 / min",
      lastRecorded: "August 18, 2026"
    }
  },

  initialAppointments: [
    {
      id: "MCP-2026-89412",
      doctorId: "doc-sarah-jenkins",
      doctorName: "Dr. Sarah Jenkins",
      doctorTitle: "MD, FACC",
      doctorDepartment: "Cardiovascular Medicine",
      doctorPhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      appointmentType: "In-Person Consultation",
      appointmentReason: "Annual cardiac baseline checkup and exercise tolerance review",
      date: "2026-08-28",
      time: "10:30",
      location: "MediCare Plus Main Medical Center, Suite 410",
      patientName: "Eleanor Vance",
      patientEmail: "eleanor.vance@example.com",
      patientPhone: "+1 (555) 234-8901",
      patientDob: "1988-04-12",
      patientGender: "Female",
      insuranceProvider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-88941029-MA",
      status: "Confirmed",
      fee: 280,
      createdAt: "2026-08-20T14:30:00.000Z"
    },
    {
      id: "MCP-2026-78103",
      doctorId: "doc-jonathan-hayes",
      doctorName: "Dr. Jonathan Hayes",
      doctorTitle: "MD, FACP",
      doctorDepartment: "Internal & Family Medicine",
      doctorPhoto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
      appointmentType: "Follow-up Visit",
      appointmentReason: "Blood pressure medication titration and quarterly lab evaluation",
      date: "2026-06-12",
      time: "09:30",
      location: "MediCare Plus Main Medical Center, Suite 204",
      patientName: "Eleanor Vance",
      patientEmail: "eleanor.vance@example.com",
      patientPhone: "+1 (555) 234-8901",
      patientDob: "1988-04-12",
      patientGender: "Female",
      insuranceProvider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-88941029-MA",
      status: "Completed",
      clinicalNotes: "Blood pressure well regulated on Lisinopril 10mg. Fasting lipid panel and renal parameters optimal. Next routine checkup in 6 months.",
      fee: 240,
      createdAt: "2026-06-01T10:00:00.000Z"
    },
    {
      id: "MCP-2026-64019",
      doctorId: "doc-rachel-sterling",
      doctorName: "Dr. Rachel Sterling",
      doctorTitle: "MD, FAAD",
      doctorDepartment: "Dermatology",
      doctorPhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      appointmentType: "In-Person Consultation",
      appointmentReason: "Annual digital dermoscopy and full-body mole examination",
      date: "2026-04-18",
      time: "14:00",
      location: "MediCare Plus Westside Specialty Pavilion, Suite 102",
      patientName: "Eleanor Vance",
      patientEmail: "eleanor.vance@example.com",
      patientPhone: "+1 (555) 234-8901",
      patientDob: "1988-04-12",
      patientGender: "Female",
      insuranceProvider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-88941029-MA",
      status: "Completed",
      clinicalNotes: "All examined cutaneous nevi benign. Recommended continued broad-spectrum mineral SPF 50 application.",
      fee: 260,
      createdAt: "2026-04-02T11:20:00.000Z"
    }
  ],

  demoPrescriptions: [
    {
      id: "RX-88419",
      medicationName: "Lisinopril Tablets USP",
      dosage: "10 mg",
      instructions: "Take 1 tablet daily by mouth every morning with water.",
      prescribingDoctor: "Dr. Jonathan Hayes, MD",
      prescribedDate: "2026-06-12",
      expirationDate: "2027-06-12",
      refillsRemaining: 3,
      status: "Active",
      pharmacy: "CVS Pharmacy #4102 — 210 Boylston St, Boston, MA"
    },
    {
      id: "RX-77291",
      medicationName: "Albuterol Sulfate HFA Inhaler",
      dosage: "90 mcg / actuation",
      instructions: "Inhale 2 puffs 15 minutes prior to strenuous exercise as needed for bronchospasm.",
      prescribingDoctor: "Dr. Jonathan Hayes, MD",
      prescribedDate: "2026-06-12",
      expirationDate: "2027-06-12",
      refillsRemaining: 2,
      status: "Active",
      pharmacy: "CVS Pharmacy #4102 — 210 Boylston St, Boston, MA"
    },
    {
      id: "RX-66104",
      medicationName: "Amoxicillin / Clavulanate (Augmentin)",
      dosage: "875 / 125 mg",
      instructions: "Take 1 tablet twice daily with food for 10 days for acute bacterial sinusitis.",
      prescribingDoctor: "Dr. Jonathan Hayes, MD",
      prescribedDate: "2025-11-04",
      expirationDate: "2025-11-20",
      refillsRemaining: 0,
      status: "Completed",
      pharmacy: "CVS Pharmacy #4102 — 210 Boylston St, Boston, MA"
    }
  ],

  demoLabResults: [
    {
      id: "LAB-2026-9041",
      testName: "Comprehensive Metabolic Panel (CMP-14) & Lipid Fractionation",
      orderDoctor: "Dr. Jonathan Hayes, MD",
      specimenDate: "2026-06-12",
      reportedDate: "2026-06-13",
      laboratory: "MediCare Plus Central Diagnostic Labs (CAP & CLIA Accredited)",
      status: "Final / Normal Range",
      summary: "All metabolic markers, fasting glucose, renal and hepatic panels within normal physiological parameters. Total cholesterol 174 mg/dL (optimal).",
      metrics: [
        { parameter: "Fasting Serum Glucose", value: "88 mg/dL", reference: "70 - 99 mg/dL", status: "Normal" },
        { parameter: "Hemoglobin A1c (HbA1c)", value: "5.3 %", reference: "< 5.7 %", status: "Optimal" },
        { parameter: "Total Serum Cholesterol", value: "174 mg/dL", reference: "< 200 mg/dL", status: "Normal" },
        { parameter: "HDL (High-Density) Cholesterol", value: "62 mg/dL", reference: "> 50 mg/dL", status: "Optimal" },
        { parameter: "LDL (Low-Density) Cholesterol", value: "94 mg/dL", reference: "< 100 mg/dL", status: "Optimal" },
        { parameter: "Serum Creatinine", value: "0.85 mg/dL", reference: "0.59 - 1.04 mg/dL", status: "Normal" },
        { parameter: "eGFR (Glomerular Filtration)", value: "> 90 mL/min/1.73m²", reference: "> 60 mL/min/1.73m²", status: "Optimal" }
      ]
    },
    {
      id: "LAB-2026-8190",
      testName: "High-Resolution Digital Bilateral Screening Mammogram",
      orderDoctor: "Dr. Jonathan Hayes, MD",
      specimenDate: "2026-05-10",
      reportedDate: "2026-05-11",
      laboratory: "MediCare Plus Westside Diagnostic Imaging Suite",
      status: "Final / Benign",
      summary: "BI-RADS Category 1: Negative. Symmetrical fibroglandular tissue, no suspicious microcalcifications, masses or architectural distortion detected.",
      metrics: [
        { parameter: "BI-RADS Assessment", value: "Category 1", reference: "Negative / Normal", status: "Normal" },
        { parameter: "Follow-up Recommendation", value: "Routine 1-year annual screening", reference: "Standard", status: "Normal" }
      ]
    }
  ],

  notifications: [
    {
      id: "notif-01",
      type: "reminder",
      title: "Upcoming Specialist Appointment Confirmation",
      message: "You have an in-person consultation with Dr. Sarah Jenkins on Friday, Aug 28, 2026 at 10:30 AM (Suite 410).",
      timestamp: "2026-08-21T09:00:00.000Z",
      read: false,
      actionUrl: "patient-portal.html#appointments"
    },
    {
      id: "notif-02",
      type: "lab",
      title: "Diagnostic Laboratory Report Published",
      message: "Comprehensive Metabolic & Lipid Panel results from June 12 are available for review in your portal.",
      timestamp: "2026-06-13T11:45:00.000Z",
      read: true,
      actionUrl: "patient-portal.html#test-results"
    },
    {
      id: "notif-03",
      type: "clinical",
      title: "Annual Preventative Health Audit Due",
      message: "You are due for your annual wellness evaluation with Dr. Jonathan Hayes.",
      timestamp: "2026-05-01T08:00:00.000Z",
      read: true,
      actionUrl: "appointment.html?doctorId=doc-jonathan-hayes"
    }
  ]
};
