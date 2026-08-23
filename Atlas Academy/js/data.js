/**
 * Atlas Academy - Master Course Catalog & Platform Data
 * Realistic, deep curriculum data across 6 core disciplines
 */

const ATLAS_DATA = {
  categories: [
    { id: "web-dev", name: "Web Development", icon: "code", count: 4 },
    { id: "python", name: "Python & Data", icon: "terminal", count: 3 },
    { id: "ui-ux", name: "UI/UX & Product Design", icon: "layout", count: 3 },
    { id: "graphic-design", name: "Graphic Design & Typography", icon: "pen-tool", count: 3 },
    { id: "digital-marketing", name: "Digital Marketing & Growth", icon: "trending-up", count: 3 },
    { id: "business", name: "Business Strategy & Tech Ops", icon: "briefcase", count: 3 }
  ],

  instructors: [
    {
      id: "inst-1",
      name: "Dr. Alistair Vance",
      title: "Former Principal Architect at Cloudflare & Staff Engineer",
      role: "Lead Systems & Distributed Computing",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Alistair has spent over 16 years architecting high-throughput distributed systems, WebAssembly runtimes, and resilient cloud infrastructures across Europe and Silicon Valley. He holds a Ph.D. in Computer Science from ETH Zürich.",
      coursesCount: 2,
      studentsCount: 14200,
      rating: 4.95,
      featured: true,
      linkedin: "#",
      github: "#"
    },
    {
      id: "inst-2",
      name: "Elena Rostova",
      title: "VP of Product Design, ex-Stripe & Linear",
      role: "Design Systems & Interaction Architecture",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      bio: "Elena specializes in design systems at scale, spatial user interfaces, and typographic clarity for complex B2B applications. Her work has defined the UI paradigms of modern productivity software.",
      coursesCount: 2,
      studentsCount: 18450,
      rating: 4.98,
      featured: true,
      linkedin: "#",
      github: "#"
    },
    {
      id: "inst-3",
      name: "Marcus Thorne",
      title: "Head of Growth Engineering, Tech Unicorns Advisory",
      role: "Quantitative Marketing & Retention Systems",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Marcus combines computer science with behavioral economics to build data-driven acquisition engines and predictive customer lifecycle models for high-growth tech firms.",
      coursesCount: 2,
      studentsCount: 9800,
      rating: 4.89,
      featured: true,
      linkedin: "#",
      github: "#"
    },
    {
      id: "inst-4",
      name: "Dr. Priya Nair",
      title: "Senior Research Scientist & Machine Learning Lead",
      role: "Applied AI & Python Data Systems",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Priya teaches scalable data pipelines, PyTorch neural modeling, and production MLOps. She has published 14 papers on efficient LLM inference and automated feature engineering.",
      coursesCount: 2,
      studentsCount: 16300,
      rating: 4.94,
      featured: true,
      linkedin: "#",
      github: "#"
    },
    {
      id: "inst-5",
      name: "Arthur Pendelton",
      title: "Creative Director & Brand Typographer",
      role: "Identity Systems & Editorial Direction",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Arthur's studio has crafted visual identities and custom typefaces for global luxury brands, cultural institutions, and world-class architectural publications.",
      coursesCount: 2,
      studentsCount: 8100,
      rating: 4.91,
      featured: false,
      linkedin: "#",
      github: "#"
    },
    {
      id: "inst-6",
      name: "Claire Montclaire",
      title: "Operating Partner & Former Series B Founder",
      role: "Venture Finance & Unit Economics",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      bio: "Claire has advised over 60 venture-backed startups on pricing power, capital allocation, executive board governance, and enterprise monetization models.",
      coursesCount: 2,
      studentsCount: 7400,
      rating: 4.92,
      featured: false,
      linkedin: "#",
      github: "#"
    }
  ],

  courses: [
    {
      id: "course-web-101",
      slug: "full-stack-typescript-cloud-architecture",
      title: "Full-Stack TypeScript & Modern Cloud Architecture",
      category: "web-dev",
      categoryName: "Web Development",
      instructorId: "inst-1",
      level: "Intermediate",
      duration: "18h 45m",
      totalLessons: 9,
      studentsCount: 4820,
      rating: 4.96,
      reviewsCount: 318,
      price: 189,
      badge: "Flagship Program",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
      tagline: "Build type-safe distributed web applications using Node.js, Next.js, GraphQL, Docker, and AWS Serverless primitives.",
      overview: "A rigorous, project-driven masterclass engineered for developers seeking to transition from writing simple scripts to designing enterprise-grade TypeScript architectures. You will construct a multi-tenant SaaS backend with robust telemetry, zero-trust auth, and automated CI/CD pipelines.",
      prerequisites: [
        "Solid foundational knowledge of JavaScript (ES6+)",
        "Basic familiarity with command line & Git",
        "Understanding of HTTP/REST primitives"
      ],
      learningOutcomes: [
        "Architect end-to-end type safety across client, API, and database layers",
        "Deploy resilient microservices with Docker, Kubernetes, and AWS CDK",
        "Implement high-performance caching strategies using Redis & CDN edge compute",
        "Master relational database schema migrations with Prisma & PostgreSQL",
        "Implement production-grade logging, tracing, and OpenTelemetry instrumentation"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: Advanced TypeScript Core & Type Mechanics",
          moduleDuration: "3h 20m",
          lessons: [
            {
              id: "les-web-101-1",
              title: "Generics, Conditional Types & Template Literal Types",
              duration: "24:10",
              videoLengthSec: 1450,
              type: "video",
              freePreview: true,
              summary: "Deep dive into TypeScript's type-level programming engine, building complex type guards and recursive utility types.",
              resources: [
                { name: "TypeScript Advanced Type Cheatsheet.pdf", size: "1.2 MB", type: "pdf" },
                { name: "module1-exercise-starter.zip", size: "450 KB", type: "zip" }
              ]
            },
            {
              id: "les-web-101-2",
              title: "Type Invariant API Contracts with Zod & OpenAPI",
              duration: "28:45",
              videoLengthSec: 1725,
              type: "video",
              freePreview: true,
              summary: "Eliminating runtime boundary bugs by deriving type schemas directly from validated input parsers.",
              resources: [
                { name: "zod-validation-patterns.ts", size: "24 KB", type: "code" }
              ]
            },
            {
              id: "les-web-101-3",
              title: "Quiz: Type Systems & Schema Invariants",
              duration: "15:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-web-101-m1"
            }
          ]
        },
        {
          moduleTitle: "Module 2: Enterprise Backend Architecture & ORM",
          moduleDuration: "5h 15m",
          lessons: [
            {
              id: "les-web-101-4",
              title: "Clean Architecture & Domain-Driven Design in Node",
              duration: "34:10",
              videoLengthSec: 2050,
              type: "video",
              freePreview: false,
              summary: "Structuring multi-tier applications with bounded contexts, repositories, and domain entities.",
              resources: [
                { name: "clean-architecture-diagram.pdf", size: "890 KB", type: "pdf" }
              ]
            },
            {
              id: "les-web-101-5",
              title: "PostgreSQL Indexing, Connection Pooling & Prisma",
              duration: "41:30",
              videoLengthSec: 2490,
              type: "video",
              freePreview: false,
              summary: "High-throughput database queries, transaction management, and connection handling with PgBouncer.",
              resources: [
                { name: "postgres-indexing-benchmark.sql", size: "12 KB", type: "code" }
              ]
            },
            {
              id: "les-web-101-6",
              title: "Authentication Architecture: Passkeys & JWT Rotation",
              duration: "36:00",
              videoLengthSec: 2160,
              type: "video",
              freePreview: false,
              summary: "Implementing secure WebAuthn biometric login and token rotation using Redis session stores."
            }
          ]
        },
        {
          moduleTitle: "Module 3: Cloud Deployment, Docker & Observability",
          moduleDuration: "6h 10m",
          lessons: [
            {
              id: "les-web-101-7",
              title: "Multi-Stage Docker Builds & Minimal Container Images",
              duration: "29:50",
              videoLengthSec: 1790,
              type: "video",
              freePreview: false,
              summary: "Optimizing container sizes for Alpine and distroless images, caching dependencies efficiently.",
              resources: [
                { name: "Dockerfile.production", size: "4 KB", type: "code" }
              ]
            },
            {
              id: "les-web-101-8",
              title: "Edge Compute, Caching & Global CDN Strategies",
              duration: "32:15",
              videoLengthSec: 1935,
              type: "video",
              freePreview: false,
              summary: "Deploying edge middleware, stale-while-revalidate caches, and global rate limiters."
            },
            {
              id: "les-web-101-9",
              title: "Capstone Assessment: Resilient Microservice Deployment",
              duration: "45:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-web-101-final"
            }
          ]
        }
      ]
    },

    {
      id: "course-uiux-201",
      slug: "enterprise-design-systems-interaction-architecture",
      title: "Enterprise Design Systems & Interaction Architecture",
      category: "ui-ux",
      categoryName: "UI/UX & Product Design",
      instructorId: "inst-2",
      level: "Advanced",
      duration: "15h 20m",
      totalLessons: 7,
      studentsCount: 3940,
      rating: 4.98,
      reviewsCount: 284,
      price: 219,
      badge: "Industry Standard",
      thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932deb4?auto=format&fit=crop&w=900&q=80",
      tagline: "Build scalable tokenized component libraries, accessible data grids, and high-fidelity micro-interactions.",
      overview: "Move beyond standard UI mockups. Learn how modern product teams create mathematical spacing scales, fluid typography variables, semantic design token pipelines (Figma to Code), and WCAG AAA compliant complex interfaces.",
      prerequisites: [
        "Proficiency with Figma (auto-layout, components, variants)",
        "Basic understanding of HTML/CSS structure",
        "Experience designing for web or mobile software"
      ],
      learningOutcomes: [
        "Construct multi-tier design token architecture (Global, Semantic, Component)",
        "Sync design tokens automatically from Figma to code repositories via Style Dictionary",
        "Design complex enterprise components: Virtualized data grids, filter builders, command palettes",
        "Conduct rigorous accessibility testing with screen readers and keyboard navigation matrix",
        "Create living documentation and governance models for 50+ designer teams"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: Design Tokens & Mathematical Foundations",
          moduleDuration: "4h 10m",
          lessons: [
            {
              id: "les-uiux-201-1",
              title: "Systemic Spacing, Modular Scales & Color Science",
              duration: "31:40",
              videoLengthSec: 1900,
              type: "video",
              freePreview: true,
              summary: "Establishing perceptual contrast curves, APCA contrast guidelines, and OKLCH color spaces.",
              resources: [
                { name: "OKLCH-Palette-Generator-Template.fig", size: "4.5 MB", type: "figma" },
                { name: "spacing-token-scale-matrix.pdf", size: "750 KB", type: "pdf" }
              ]
            },
            {
              id: "les-uiux-201-2",
              title: "Token Architecture: Figma Variables to JSON Pipelines",
              duration: "38:20",
              videoLengthSec: 2300,
              type: "video",
              freePreview: true,
              summary: "Configuring multi-mode design tokens (dark mode, compact density, brand themes) in Figma.",
              resources: [
                { name: "tokens-export-config.json", size: "18 KB", type: "json" }
              ]
            },
            {
              id: "les-uiux-201-3",
              title: "Knowledge Check: Token Hierarchy & Color Semantics",
              duration: "20:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-uiux-201-m1"
            }
          ]
        },
        {
          moduleTitle: "Module 2: Complex Component Engineering",
          moduleDuration: "5h 40m",
          lessons: [
            {
              id: "les-uiux-201-4",
              title: "Enterprise Data Tables: Fixed Columns, Inline Edits & Density",
              duration: "44:10",
              videoLengthSec: 2650,
              type: "video",
              freePreview: false,
              summary: "Designing robust tabular interfaces capable of displaying 10,000+ financial transaction rows.",
              resources: [
                { name: "DataGrid-Component-Spec.pdf", size: "1.4 MB", type: "pdf" }
              ]
            },
            {
              id: "les-uiux-201-5",
              title: "Modal Systems, Focus Traps & Spatial Overlays",
              duration: "35:15",
              videoLengthSec: 2115,
              type: "video",
              freePreview: false,
              summary: "Architecting accessible floating panels, popovers, and keyboard-navigable command bars."
            }
          ]
        },
        {
          moduleTitle: "Module 3: Systems Governance & Documentation",
          moduleDuration: "4h 30m",
          lessons: [
            {
              id: "les-uiux-201-6",
              title: "Version Control for Components & Breaking Changes",
              duration: "28:40",
              videoLengthSec: 1720,
              type: "video",
              freePreview: false,
              summary: "Deprecation strategies, component changelogs, and team adoption tracking."
            },
            {
              id: "les-uiux-201-7",
              title: "Comprehensive Design Systems Master Exam",
              duration: "30:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-uiux-201-final"
            }
          ]
        }
      ]
    },

    {
      id: "course-py-301",
      slug: "python-data-engineering-scalable-pipelines",
      title: "Python for Data Engineering & Production Pipelines",
      category: "python",
      categoryName: "Python & Data",
      instructorId: "inst-4",
      level: "Intermediate",
      duration: "21h 10m",
      totalLessons: 7,
      studentsCount: 5610,
      rating: 4.93,
      reviewsCount: 412,
      price: 199,
      badge: "High Demand",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
      tagline: "Build resilient ETL workflows, PySpark distributed jobs, and automated feature pipelines.",
      overview: "Master modern data engineering using Python 3.12+, Polars, DuckDB, Apache Arrow, and Dagster. Learn how to ingest raw streaming events, transform petabyte-scale datasets, and maintain rigorous data quality assertions.",
      prerequisites: [
        "Basic Python programming (functions, dictionaries, lists)",
        "Fundamental SQL querying (JOINs, aggregations, window functions)",
        "Basic command line usage"
      ],
      learningOutcomes: [
        "Process multi-gigabyte data in milliseconds using Polars and Apache Arrow",
        "Author declarative data pipelines using Dagster and dbt",
        "Implement zero-downtime database replication via Change Data Capture (CDC)",
        "Write automated unit and integration tests for data transformation stages",
        "Deploy containerized pipeline workers to cloud orchestrators"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: High-Performance Python & Vectorized Processing",
          moduleDuration: "5h 10m",
          lessons: [
            {
              id: "les-py-301-1",
              title: "Polars vs Pandas 2.0: Memory Layout & Lazy Execution",
              duration: "36:45",
              videoLengthSec: 2205,
              type: "video",
              freePreview: true,
              summary: "Exploring columnar memory formats, Rust query optimizers, and parallelized execution plans.",
              resources: [
                { name: "polars-lazy-benchmark.ipynb", size: "680 KB", type: "code" }
              ]
            },
            {
              id: "les-py-301-2",
              title: "DuckDB for Analytical OLAP Queries on Parquet Files",
              duration: "40:15",
              videoLengthSec: 2415,
              type: "video",
              freePreview: true,
              summary: "Executing sub-second SQL queries directly over compressed remote S3 Parquet lakes.",
              resources: [
                { name: "duckdb-parquet-lake-queries.sql", size: "15 KB", type: "code" }
              ]
            },
            {
              id: "les-py-301-3",
              title: "Quiz: Vectorized Computations & Arrow Mechanics",
              duration: "20:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-py-301-m1"
            }
          ]
        },
        {
          moduleTitle: "Module 2: Pipeline Orchestration & Data Quality",
          moduleDuration: "6h 30m",
          lessons: [
            {
              id: "les-py-301-4",
              title: "Declarative Orchestration with Dagster Software-Defined Assets",
              duration: "45:00",
              videoLengthSec: 2700,
              type: "video",
              freePreview: false,
              summary: "Defining data dependencies, partitioning strategies, and automated reconciliation schedules."
            },
            {
              id: "les-py-301-5",
              title: "Great Expectations & Automated Data Contract Verification",
              duration: "33:20",
              videoLengthSec: 2000,
              type: "video",
              freePreview: false,
              summary: "Setting up continuous schema validation, null checks, and anomaly detection gates."
            }
          ]
        },
        {
          moduleTitle: "Module 3: Production Pipeline Engineering",
          moduleDuration: "7h 00m",
          lessons: [
            {
              id: "les-py-301-6",
              title: "Streaming Event Processing with Kafka & Async Python",
              duration: "48:10",
              videoLengthSec: 2890,
              type: "video",
              freePreview: false,
              summary: "Consuming real-time WebSocket firehoses and persisting time-series state."
            },
            {
              id: "les-py-301-7",
              title: "Data Engineering Capstone Assessment",
              duration: "30:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-py-301-final"
            }
          ]
        }
      ]
    },

    {
      id: "course-des-401",
      slug: "brand-identity-editorial-typography",
      title: "Brand Identity, Visual Systems & Editorial Typography",
      category: "graphic-design",
      categoryName: "Graphic Design & Typography",
      instructorId: "inst-5",
      level: "Intermediate",
      duration: "13h 40m",
      totalLessons: 6,
      studentsCount: 2780,
      rating: 4.92,
      reviewsCount: 198,
      price: 179,
      badge: "Editorial Master",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
      tagline: "Master bespoke typographic hierarchies, Swiss grid structures, and enduring brand identities.",
      overview: "An intensive studio course on the principles of disciplined visual communication. Dive into the art of custom mark making, typographic pairing, proportion systems, and comprehensive brand guideline documentation for cultural and commercial institutions.",
      prerequisites: [
        "Working knowledge of vector design tools (Illustrator, InDesign, or Figma)",
        "Passion for typography, layout, and visual balance"
      ],
      learningOutcomes: [
        "Establish expressive typographic scales using classical Swiss and modernist grids",
        "Design scalable corporate visual identities from concept to master asset delivery",
        "Master the technical craft of font pairing, optical kerning, and micro-typography",
        "Produce tactile print collateral specifications and digital brand design guidelines"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: Typographic Foundations & Anatomy",
          moduleDuration: "3h 50m",
          lessons: [
            {
              id: "les-des-401-1",
              title: "History of Letterforms, Classification & Optical Adjustments",
              duration: "35:10",
              videoLengthSec: 2110,
              type: "video",
              freePreview: true,
              summary: "Understanding serifs, terminals, ascenders, and optical balance in logo craftsmanship.",
              resources: [
                { name: "Atlas-Typographic-Specimen.pdf", size: "3.2 MB", type: "pdf" }
              ]
            },
            {
              id: "les-des-401-2",
              title: "The Swiss Grid: Rational Proportion Systems & Baseline Grids",
              duration: "42:00",
              videoLengthSec: 2520,
              type: "video",
              freePreview: true,
              summary: "Constructing multi-column hierarchical layouts with mathematical precision.",
              resources: [
                { name: "Modernist-Grid-Templates.idml", size: "8.1 MB", type: "indesign" }
              ]
            },
            {
              id: "les-des-401-3",
              title: "Quiz: Typographic Anatomy & Grid Calculations",
              duration: "15:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-des-401-m1"
            }
          ]
        },
        {
          moduleTitle: "Module 2: Complete Identity System Architecture",
          moduleDuration: "5h 20m",
          lessons: [
            {
              id: "les-des-401-4",
              title: "Identity Systems in Practice: Signage, Print & Screen",
              duration: "39:30",
              videoLengthSec: 2370,
              type: "video",
              freePreview: false,
              summary: "Translating static marks into responsive identity frameworks across diverse mediums."
            },
            {
              id: "les-des-401-5",
              title: "Authoring the Brand Manual: Governance & Rulebooks",
              duration: "44:00",
              videoLengthSec: 2640,
              type: "video",
              freePreview: false,
              summary: "Documenting clear logo clearspaces, forbidden usages, and voice tone principles."
            }
          ]
        },
        {
          moduleTitle: "Module 3: Capstone & Portfolio Review",
          moduleDuration: "4h 30m",
          lessons: [
            {
              id: "les-des-401-6",
              title: "Editorial Brand Capstone Exam & Presentation",
              duration: "30:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-des-401-final"
            }
          ]
        }
      ]
    },

    {
      id: "course-mkt-501",
      slug: "growth-engineering-performance-marketing",
      title: "Growth Engineering, Retention Systems & Analytics",
      category: "digital-marketing",
      categoryName: "Digital Marketing & Growth",
      instructorId: "inst-3",
      level: "Advanced",
      duration: "16h 30m",
      totalLessons: 6,
      studentsCount: 3120,
      rating: 4.89,
      reviewsCount: 172,
      price: 199,
      badge: "Executive",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      tagline: "Build scientific experimentation engines, cohort retention matrices, and acquisition loops.",
      overview: "Escape superficial growth hacking tricks. Learn the rigorous methodologies used by premier tech companies to model customer acquisition costs (CAC), lifetime value (LTV), cohort retention curves, and high-velocity multi-variant experiments.",
      prerequisites: [
        "Foundational understanding of digital marketing channels",
        "Familiarity with spreadsheets or SQL data tables"
      ],
      learningOutcomes: [
        "Construct quantitative growth models to project ARR and organic viral loops",
        "Design and evaluate statistical A/B tests with proper sample size sizing",
        "Build automated event attribution pipelines using Segment and PostHog",
        "Optimize onboarding flows to compress Time-to-First-Value (TTFV)"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: Quantitative Growth Modeling & Loops",
          moduleDuration: "4h 40m",
          lessons: [
            {
              id: "les-mkt-501-1",
              title: "Product Loops vs Linear Funnels: The Math of Compounding",
              duration: "37:20",
              videoLengthSec: 2240,
              type: "video",
              freePreview: true,
              summary: "Designing user-to-user viral loops, UGC SEO loops, and paid reinvestment cycles.",
              resources: [
                { name: "Growth-Model-Spreadsheet-v4.xlsx", size: "1.8 MB", type: "excel" }
              ]
            },
            {
              id: "les-mkt-501-2",
              title: "Cohort Analysis & Calculating True Retention Ceilings",
              duration: "41:10",
              videoLengthSec: 2470,
              type: "video",
              freePreview: true,
              summary: "Differentiating smiling retention curves from leaky bucket attrition patterns."
            },
            {
              id: "les-mkt-501-3",
              title: "Quiz: Growth Loops & Retention Mathematics",
              duration: "20:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-mkt-501-m1"
            }
          ]
        },
        {
          moduleTitle: "Module 2: Experimentation Rigor & Analytics",
          moduleDuration: "5h 50m",
          lessons: [
            {
              id: "les-mkt-501-4",
              title: "Statistical Significance, P-Values & Sample Ratio Mismatches",
              duration: "46:00",
              videoLengthSec: 2760,
              type: "video",
              freePreview: false,
              summary: "Avoiding false positives and premature test conclusions in high-stakes funnels."
            },
            {
              id: "les-mkt-501-5",
              title: "Full-Funnel Telemetry: Event Schemas & Server-Side Tracking",
              duration: "38:40",
              videoLengthSec: 2320,
              type: "video",
              freePreview: false,
              summary: "Implementing robust Conversion API (CAPI) events and warehouse attribution."
            }
          ]
        },
        {
          moduleTitle: "Module 3: Capstone Growth Audit",
          moduleDuration: "4h 00m",
          lessons: [
            {
              id: "les-mkt-501-6",
              title: "Comprehensive Growth Strategy & Analytics Exam",
              duration: "30:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-mkt-501-final"
            }
          ]
        }
      ]
    },

    {
      id: "course-biz-601",
      slug: "technology-strategy-venture-finance",
      title: "Technology Strategy, Unit Economics & Venture Finance",
      category: "business",
      categoryName: "Business Strategy & Tech Ops",
      instructorId: "inst-6",
      level: "Advanced",
      duration: "14h 15m",
      totalLessons: 6,
      studentsCount: 2190,
      rating: 4.95,
      reviewsCount: 145,
      price: 249,
      badge: "Board Level",
      thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
      tagline: "Master SaaS pricing power, cap table mechanics, capital allocation, and enterprise sales motions.",
      overview: "Written for founders, directors, and aspiring tech executives. Gain an unapologetically rigorous breakdown of corporate unit economics, venture debt, term sheet negotiation, gross margin optimization, and competitive defensibility moats.",
      prerequisites: [
        "Basic understanding of income statements and business models",
        "Executive or managerial interest in tech operations"
      ],
      learningOutcomes: [
        "Deconstruct SaaS income statements: Net Revenue Retention (NRR), CAC payback, and burn multiples",
        "Model dynamic capitalization tables, equity dilution pools, and liquidation preferences",
        "Design value-metric pricing strategies to drive annual contract value (ACV) expansion",
        "Formulate competitive moats (network effects, switching costs, regulatory barriers)"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: SaaS Financial Architecture & Unit Economics",
          moduleDuration: "4h 30m",
          lessons: [
            {
              id: "les-biz-601-1",
              title: "The SaaS P&L: Gross Margins, COGS & Rule of 40",
              duration: "38:20",
              videoLengthSec: 2300,
              type: "video",
              freePreview: true,
              summary: "Analyzing balance sheets, deferred revenue recognition, and healthy burn rates.",
              resources: [
                { name: "SaaS-Unit-Economics-Matrix.xlsx", size: "2.1 MB", type: "excel" }
              ]
            },
            {
              id: "les-biz-601-2",
              title: "Pricing Psychology & Value Metrics That Expand With Usage",
              duration: "42:50",
              videoLengthSec: 2570,
              type: "video",
              freePreview: true,
              summary: "Migrating from per-seat pricing to outcome-based and consumption metrics."
            },
            {
              id: "les-biz-601-3",
              title: "Quiz: Unit Economics & SaaS Financial Formulas",
              duration: "20:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-biz-601-m1"
            }
          ]
        },
        {
          moduleTitle: "Module 2: Capital Allocation & Term Sheets",
          moduleDuration: "5h 15m",
          lessons: [
            {
              id: "les-biz-601-4",
              title: "Term Sheet Mechanics: Participating Preferred vs Non-Participating",
              duration: "47:00",
              videoLengthSec: 2820,
              type: "video",
              freePreview: false,
              summary: "Protecting founder equity across consecutive financing rounds and down-rounds."
            },
            {
              id: "les-biz-601-5",
              title: "Strategic Moats: Defensibility in the Age of AI Disruption",
              duration: "36:10",
              videoLengthSec: 2170,
              type: "video",
              freePreview: false,
              summary: "Assessing proprietary data feedback loops and switching friction."
            }
          ]
        },
        {
          moduleTitle: "Module 3: Executive Capstone",
          moduleDuration: "3h 30m",
          lessons: [
            {
              id: "les-biz-601-6",
              title: "Venture Finance & Strategy Master Exam",
              duration: "30:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-biz-601-final"
            }
          ]
        }
      ]
    },

    {
      id: "course-web-102",
      slug: "react-server-components-design-systems",
      title: "React Architecture, Next.js App Router & Server Components",
      category: "web-dev",
      categoryName: "Web Development",
      instructorId: "inst-1",
      level: "Advanced",
      duration: "17h 15m",
      totalLessons: 4,
      studentsCount: 3650,
      rating: 4.94,
      reviewsCount: 220,
      price: 189,
      badge: "Cutting Edge",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
      tagline: "Master React 19 concurrent features, streaming SSR, Server Actions, and distributed state.",
      overview: "A deep dive into modern React execution models, zero-bundle-size server components, optimistic UI mutation patterns, and high-performance suspense streaming boundaries.",
      prerequisites: [
        "Proficiency with React fundamentals (hooks, state, JSX)",
        "Basic TypeScript experience"
      ],
      learningOutcomes: [
        "Architect streaming server-rendered pages with nested Suspense boundaries",
        "Implement mutation workflows with Server Actions and optimistic rollback",
        "Build polymorphic UI components with Radix UI and Tailwind CSS",
        "Diagnose and eliminate layout shifts and hydration mismatches"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: Server Components Mental Model",
          moduleDuration: "4h 00m",
          lessons: [
            {
              id: "les-web-102-1",
              title: "RSC Wire Protocol: How React Serializes the Component Tree",
              duration: "32:10",
              videoLengthSec: 1930,
              type: "video",
              freePreview: true,
              summary: "Inspecting the flight payload, server module references, and client boundaries."
            },
            {
              id: "les-web-102-2",
              title: "Data Fetching & Waterfall Elimination Strategies",
              duration: "35:40",
              videoLengthSec: 2140,
              type: "video",
              freePreview: true,
              summary: "Parallel data fetching with React.cache and deduped requests."
            }
          ]
        },
        {
          moduleTitle: "Module 2: Server Actions & Mutative UI",
          moduleDuration: "5h 20m",
          lessons: [
            {
              id: "les-web-102-3",
              title: "Server Actions: Progressive Enhancement & Form Validation",
              duration: "38:00",
              videoLengthSec: 2280,
              type: "video",
              freePreview: false,
              summary: "Handling form submissions without client JavaScript and managing pending states."
            },
            {
              id: "les-web-102-4",
              title: "Quiz: RSC Architecture & Server Action Security",
              duration: "15:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-web-102-m1"
            }
          ]
        }
      ]
    },

    {
      id: "course-py-302",
      slug: "applied-deep-learning-llm-fine-tuning",
      title: "Applied Deep Learning: Fine-Tuning LLMs & Vector Retrieval",
      category: "python",
      categoryName: "Python & Data",
      instructorId: "inst-4",
      level: "Advanced",
      duration: "19h 40m",
      totalLessons: 4,
      studentsCount: 4210,
      rating: 4.97,
      reviewsCount: 310,
      price: 229,
      badge: "AI Specialist",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
      tagline: "Build production RAG pipelines, quantize transformer models, and fine-tune open weights with LoRA.",
      overview: "Practical, hands-on deep learning for software engineers. Learn parameter-efficient fine-tuning (LoRA / QLoRA), semantic embedding indexing with Qdrant, reranking models, and latency-optimized local inference with vLLM.",
      prerequisites: [
        "Intermediate Python & PyTorch fundamentals",
        "Understanding of linear algebra & basic calculus"
      ],
      learningOutcomes: [
        "Fine-tune Llama 3 and Mistral models on specialized domain datasets",
        "Deploy hybrid vector and keyword search retrieval pipelines (RAG)",
        "Optimize model inference using 4-bit and 8-bit quantization (bitsandbytes)",
        "Implement continuous evaluation benchmarks for generative outputs"
      ],
      curriculum: [
        {
          moduleTitle: "Module 1: Vector Embeddings & Hybrid Retrieval",
          moduleDuration: "5h 15m",
          lessons: [
            {
              id: "les-py-302-1",
              title: "Dense vs Sparse Embeddings & Cross-Encoder Rerankers",
              duration: "37:50",
              videoLengthSec: 2270,
              type: "video",
              freePreview: true,
              summary: "Constructing multi-stage retrieval pipelines for high-precision context retrieval."
            },
            {
              id: "les-py-302-2",
              title: "Chunking Strategies & Context Window Management",
              duration: "34:20",
              videoLengthSec: 2060,
              type: "video",
              freePreview: true,
              summary: "Semantic boundary chunking and metadata preservation for technical documentation."
            }
          ]
        },
        {
          moduleTitle: "Module 2: Parameter-Efficient Fine-Tuning (LoRA)",
          moduleDuration: "6h 30m",
          lessons: [
            {
              id: "les-py-302-3",
              title: "Low-Rank Adaptation: Mathematics & Rank Dimension Tuning",
              duration: "45:10",
              videoLengthSec: 2710,
              type: "video",
              freePreview: false,
              summary: "Injecting trainable rank decomposition matrices into frozen attention layers."
            },
            {
              id: "les-py-302-4",
              title: "LLM Fine-Tuning & Evaluation Capstone Quiz",
              duration: "25:00",
              type: "quiz",
              freePreview: false,
              quizId: "quiz-py-302-m1"
            }
          ]
        }
      ]
    }
  ],

  quizzes: {
    "quiz-web-101-m1": {
      id: "quiz-web-101-m1",
      title: "Assessment: Type Systems & Schema Invariants",
      courseId: "course-web-101",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "Which TypeScript operator is used to extract the return type of an asynchronous function returning a Promise?",
          options: [
            "ReturnType<T>",
            "Awaited<ReturnType<T>>",
            "PromiseType<T>",
            "Unwrap<T>"
          ],
          correctIndex: 1,
          explanation: "In modern TypeScript, ReturnType<T> retrieves the Promise itself, while Awaited<ReturnType<T>> resolves the inner resolved value."
        },
        {
          id: "q2",
          question: "Why should API request validation schemas (like Zod) be defined as the single source of truth rather than static TS interfaces?",
          options: [
            "Static interfaces compile faster in Webpack",
            "TypeScript interfaces are erased at runtime and cannot validate real user payloads",
            "Zod eliminates the need for HTTP status codes",
            "Interfaces cannot support strings or numbers"
          ],
          correctIndex: 1,
          explanation: "TypeScript types do not exist in JavaScript runtime. Schema libraries like Zod validate dynamic payloads at runtime and infer matching static types."
        },
        {
          id: "q3",
          question: "What is the primary benefit of Template Literal Types in TypeScript?",
          options: [
            "They allow string interpolation inside JSX without curly braces",
            "They enable type-safe pattern matching and concatenation of string literals at compile time",
            "They optimize string memory allocation in V8",
            "They replace regular expressions in production"
          ],
          correctIndex: 1,
          explanation: "Template Literal Types allow building precise string types like `on${Capitalize<Event>}` or `/${string}/${number}` with strict compiler verification."
        },
        {
          id: "q4",
          question: "What occurs when the 'never' type is returned in an exhaustive switch check?",
          options: [
            "The program throws an uncaught JavaScript runtime error immediately",
            "The TypeScript compiler alerts you at build-time if any union case was unhandled",
            "The function returns undefined silently",
            "The garbage collector purges the object from RAM"
          ],
          correctIndex: 1,
          explanation: "Exhaustiveness checking assigns the unhandled case to 'never', prompting a compile-time error if new union members are added without handling."
        }
      ]
    },

    "quiz-web-101-final": {
      id: "quiz-web-101-final",
      title: "Capstone Assessment: Cloud Architecture & Deployment",
      courseId: "course-web-101",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          question: "In high-throughput PostgreSQL architectures, why is PgBouncer or connection pooling critical for Node.js microservices?",
          options: [
            "PostgreSQL allocates a dedicated process and memory buffer per connection, which exhausts RAM under high concurrent Node connection spikes",
            "Node.js cannot send SQL strings directly to PostgreSQL without an intermediary",
            "PgBouncer translates SQL queries into GraphQL automatically",
            "It encrypts passwords with SHA-256"
          ],
          correctIndex: 0,
          explanation: "Postgres uses a process-per-client model. Spawning thousands of connections causes severe CPU context switching and RAM exhaustion."
        },
        {
          id: "q2",
          question: "What is the primary architectural purpose of OpenTelemetry trace contexts passed across distributed HTTP headers (W3C traceparent)?",
          options: [
            "To encrypt database passwords in transit",
            "To correlate end-to-end request spans across multiple distinct services into a unified execution waterfall",
            "To compress payload bodies with Brotli",
            "To automatically restart failing microservices"
          ],
          correctIndex: 1,
          explanation: "Distributed tracing propagates span and trace IDs across network hops so you can pinpoint exact bottlenecks in distributed architectures."
        },
        {
          id: "q3",
          question: "When constructing multi-stage Dockerfiles for Node.js, what is the key reason to separate the build stage from the runner stage?",
          options: [
            "Docker does not support TypeScript compiler in single stages",
            "To exclude heavy development dependencies, compilers, and source files from the final minimal production image",
            "It allows the container to run on Windows and Linux simultaneously",
            "It speeds up CPU clock frequency"
          ],
          correctIndex: 1,
          explanation: "Multi-stage builds drastically reduce security attack surface and image size by discarding compilers and build-only packages."
        },
        {
          id: "q4",
          question: "What does the 'stale-while-revalidate' HTTP Cache-Control header directive instruct the client/CDN to do?",
          options: [
            "Always block the user until a fresh origin server request finishes",
            "Instantly serve the cached (stale) asset to the user while asynchronously fetching a fresh copy in the background",
            "Delete the browser cache after 24 hours",
            "Encrypt cache storage on disk"
          ],
          correctIndex: 1,
          explanation: "SWR provides instantaneous response times by serving cached content while updating the cache out-of-band for future requests."
        }
      ]
    },

    "quiz-uiux-201-m1": {
      id: "quiz-uiux-201-m1",
      title: "Knowledge Check: Design Tokens & Color Semantics",
      courseId: "course-uiux-201",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "What is the primary purpose of introducing a Semantic Token layer between Global (Raw) values and Component tokens?",
          options: [
            "To increase CSS file sizes",
            "To decouple intent (e.g., surface-primary, text-muted) from absolute values (e.g., #1E293B), enabling seamless theme and dark mode switching",
            "To replace standard SVG icons with font glyphs",
            "To prevent frontend developers from reading design files"
          ],
          correctIndex: 1,
          explanation: "Semantic tokens encode contextual meaning, allowing themes to switch global values without touching individual component implementations."
        },
        {
          id: "q2",
          question: "Why is the OKLCH color model preferred over legacy sRGB/HSL in modern design systems?",
          options: [
            "It was invented by Apple for Retina displays only",
            "It is perceptually uniform across hues, preventing sudden perceived brightness shifts when adjusting lightness or chroma",
            "It removes alpha opacity channels",
            "It eliminates the need for contrast testing"
          ],
          correctIndex: 1,
          explanation: "OKLCH delivers predictable perceptual lightness across the color spectrum, making algorithmic palette generation consistent."
        },
        {
          id: "q3",
          question: "In enterprise data tables, what is the recommended minimum touch/click target size for interactive controls according to WCAG 2.2?",
          options: [
            "12x12 CSS pixels",
            "24x24 CSS pixels minimum (with 44x44 recommended for high-frequency interactions)",
            "100x100 CSS pixels",
            "No minimum size is specified"
          ],
          correctIndex: 1,
          explanation: "WCAG 2.2 introduces a 24x24 minimum target size requirement (Level AA) with 44x44 recommended for touch interactions."
        }
      ]
    },

    "quiz-uiux-201-final": {
      id: "quiz-uiux-201-final",
      title: "Design Systems Master Comprehensive Exam",
      courseId: "course-uiux-201",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "When refactoring a design system with breaking changes across 40+ engineering repositories, what is the safest migration strategy?",
          options: [
            "Delete old components immediately to force compliance",
            "Codemod transformations combined with semantic component aliasing and deprecation warnings",
            "Create a completely new CSS file without telling anyone",
            "Require all engineers to stop shipping features for 6 months"
          ],
          correctIndex: 1,
          explanation: "Automated AST codemods paired with runtime deprecation logs ensure smooth zero-downtime component migrations at enterprise scale."
        },
        {
          id: "q2",
          question: "What is the primary ARIA attribute required to announce dynamic content changes (such as notification toasts or live table search updates) to screen readers?",
          options: [
            "aria-hidden='true'",
            "aria-live='polite' or aria-live='assertive'",
            "aria-label='loading'",
            "aria-disabled='false'"
          ],
          correctIndex: 1,
          explanation: "The aria-live attribute allows assistive technologies to announce real-time UI changes without interrupting the user's active focus flow."
        }
      ]
    },

    "quiz-py-301-m1": {
      id: "quiz-py-301-m1",
      title: "Vectorized Computations & Arrow Mechanics",
      courseId: "course-py-301",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "Why does Polars significantly outperform Pandas when querying large datasets?",
          options: [
            "Polars runs exclusively inside web browsers using WebAssembly",
            "Polars uses an Apache Arrow columnar memory format in Rust with multi-threaded lazy query optimization and zero-copy slicing",
            "Polars does not support mathematical operations",
            "Polars converts all tables into JSON strings"
          ],
          correctIndex: 1,
          explanation: "Polars builds a logical query plan, reorders operations to eliminate unused columns early (projection pushdown), and executes in parallel over contiguous SIMD memory."
        },
        {
          id: "q2",
          question: "What is 'Predicate Pushdown' in modern Parquet lakehouse queries?",
          options: [
            "Pushing error logs directly to the terminal",
            "Filtering data rows at the storage/reader level using Parquet file statistics before loading the bytes into application memory",
            "Translating Python scripts into C++",
            "Compressing files with GZIP"
          ],
          correctIndex: 1,
          explanation: "Predicate pushdown inspects Parquet column chunk min/max metadata and skips reading irrelevant blocks from disk entirely."
        }
      ]
    },

    "quiz-des-401-m1": {
      id: "quiz-des-401-m1",
      title: "Typographic Anatomy & Grid Calculations",
      courseId: "course-des-401",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "What is the x-height of a typeface, and why is it critical for editorial readability at small sizes?",
          options: [
            "The height of uppercase letters like 'X'",
            "The vertical height of lowercase letters (such as 'x', 'a', 'o'); typefaces with higher x-heights remain substantially more legible at small point sizes",
            "The slant angle of italic glyphs",
            "The space between adjacent paragraphs"
          ],
          correctIndex: 1,
          explanation: "A generous x-height gives lowercase letters larger internal counters and optical presence, improving legibility on low-resolution displays and small print captions."
        },
        {
          id: "q2",
          question: "In classical Swiss Grid systems, what determines the relationship between the baseline grid and body copy line-height?",
          options: [
            "The baseline grid must be an integer multiple or divisor of the primary body text line-height (leading) to ensure strict vertical rhythm",
            "It must always be exactly 100 pixels",
            "The baseline grid is purely decorative and should not align with text",
            "It depends on the operating system default"
          ],
          correctIndex: 0,
          explanation: "Aligning all headings, body text, and images to consistent baseline grid increments (e.g. 4pt / 8pt) establishes disciplined vertical harmony across columns."
        }
      ]
    },

    "quiz-mkt-501-m1": {
      id: "quiz-mkt-501-m1",
      title: "Growth Loops & Retention Mathematics",
      courseId: "course-mkt-501",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "Why are closed-loop acquisition loops inherently more defensible than linear paid ad funnels?",
          options: [
            "They are 100% free of engineering effort",
            "Each cohort of active users naturally reinvests value or generates inputs that bring in subsequent cohorts, lowering blended CAC and compounding organically",
            "They eliminate customer support inquiries",
            "They require no analytics tracking"
          ],
          correctIndex: 1,
          explanation: "Linear funnels require constant marginal ad spend per new user. Growth loops reinvest output actions into input acquisition, producing non-linear compounding."
        },
        {
          id: "q2",
          question: "What is the primary indicator that a product has achieved true retention product-market fit?",
          options: [
            "High Day-1 signup numbers",
            "The cohort retention curve asymptotically flattens parallel to the x-axis after 30-90 days, indicating a stable baseline of retained users",
            "Lots of social media impressions",
            "A high number of app downloads"
          ],
          correctIndex: 1,
          explanation: "A flattening retention curve means churn drops to near zero for the retained core cohort, validating lasting utility."
        }
      ]
    },

    "quiz-biz-601-m1": {
      id: "quiz-biz-601-m1",
      title: "Unit Economics & SaaS Financial Formulas",
      courseId: "course-biz-601",
      passingScore: 80,
      questions: [
        {
          id: "q1",
          question: "How is Net Revenue Retention (NRR) calculated in enterprise SaaS?",
          options: [
            "(Starting ARR + Expansions - Contractions - Churn) / Starting ARR * 100",
            "Total Sales / Number of Employees",
            "Monthly Ad Spend / New Signups",
            "Gross Margin * Discount Rate"
          ],
          correctIndex: 0,
          explanation: "NRR measures the percentage of recurring revenue retained from existing customers over a period, incorporating upsells, downgrades, and churn."
        },
        {
          id: "q2",
          question: "What does the 'Rule of 40' evaluate in high-growth software companies?",
          options: [
            "That a team should never have more than 40 managers",
            "That the sum of YoY Revenue Growth Rate percentage and Free Cash Flow / Profit Margin percentage should equal or exceed 40%",
            "That 40% of all code should be open-sourced",
            "That software servers should run at 40% CPU utilization"
          ],
          correctIndex: 1,
          explanation: "The Rule of 40 is a gold standard metric balancing growth rate with operational profitability."
        }
      ]
    }
  },

  testimonials: [
    {
      name: "Dr. Jonathan Mercer",
      role: "VP of Engineering at Watershed",
      quote: "Atlas Academy is the single most rigorous online education platform our team has utilized. The curriculum skips superficial tutorials and teaches the actual systems architecture required in tier-1 engineering organizations.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Siddharth Mehta",
      role: "Staff Product Designer, Figma Ecosystem",
      quote: "Elena Rostova’s Design Systems masterclass reshaped how our design and engineering departments collaborate on tokenized systems. The quality of syllabus is comparable to executive executive seminars.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Camille Dubois",
      role: "Principal Data Architect, Stripe",
      quote: "The Python Data Engineering track gave me the precise blueprint for building sub-second analytical engines with Polars and Dagster. Atlas sets the standard for technical mastery.",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
    }
  ],

  pricingPlans: [
    {
      id: "plan-starter",
      name: "Individual Single",
      subtitle: "For dedicated professionals targeting single-domain mastery.",
      monthlyPrice: 29,
      annualPrice: 24,
      billingNote: "Billed annually ($288/yr) or $29/mo",
      popular: false,
      features: [
        "Full access to 1 flagship course of your choice",
        "Interactive lesson player & code exercises",
        "Official verifiable Certificate of Completion",
        "Downloadable cheat sheets & project source code",
        "Community discussion forum access",
        "Lifetime updates for enrolled course"
      ],
      ctaText: "Enroll Single Course",
      badge: ""
    },
    {
      id: "plan-pro",
      name: "Atlas All-Access Pro",
      subtitle: "Unlimited access to our complete executive and technical catalog.",
      monthlyPrice: 49,
      annualPrice: 39,
      billingNote: "Billed annually ($468/yr) or $49/mo",
      popular: true,
      features: [
        "Unlimited access to ALL courses across all 6 disciplines",
        "All upcoming new courses and curriculum releases",
        "Interactive quizzes, capstone grading & certificates",
        "Private Slack / Discord executive peer network",
        "Monthly live Q&A sessions with lead instructors",
        "Offline syllabus access & JSON data exports",
        "Priority 1-on-1 code reviews on capstone projects"
      ],
      ctaText: "Start 14-Day Free Trial",
      badge: "Most Popular"
    },
    {
      id: "plan-enterprise",
      name: "Atlas for Enterprise",
      subtitle: "Upskilling and talent retention for forward-thinking technology teams.",
      monthlyPrice: 89,
      annualPrice: 79,
      billingNote: "Per seat / month, min 5 seats",
      popular: false,
      features: [
        "Full All-Access Pro seats for your entire organization",
        "Centralized team analytics & progress dashboards",
        "Custom learning path curation for team roles",
        "SSO / SAML 2.0 & SCIM identity integration",
        "Dedicated corporate success manager",
        "Private bespoke live cohort workshops",
        "Custom invoice billing & vendor onboarding"
      ],
      ctaText: "Contact Enterprise Sales",
      badge: "Enterprise"
    }
  ],

  faqs: [
    {
      question: "What makes Atlas Academy fundamentally different from typical video course sites?",
      answer: "Atlas Academy is designed specifically for practicing professionals, senior engineers, and design leaders. We avoid generic, surface-level syntax overviews and instead focus on production architecture, system resilience, mathematical foundations, and enterprise decision-making taught by veteran industry practitioners."
    },
    {
      question: "Are the Certificates of Completion officially verifiable?",
      answer: "Yes. Every certificate generated upon 100% course and quiz completion includes a unique cryptographic verification identifier, complete curriculum breakdown, instructor signature, and a dedicated permanent verification URL suitable for LinkedIn and resume credentials."
    },
    {
      question: "Can I download course materials and source code for offline study?",
      answer: "Yes. Every lesson includes comprehensive downloadable resources (PDF cheatsheets, architecture diagrams, starter Git repositories) and our student portal enables complete JSON export of all your personal notes, bookmarks, and quiz histories."
    },
    {
      question: "Can my employer reimburse my Atlas subscription or course fee?",
      answer: "Over 82% of Atlas Academy students have their subscriptions fully reimbursed through their company's annual continuing education or L&D stipend. We provide itemized corporate VAT/tax receipts instantly upon checkout."
    },
    {
      question: "What is your refund and cancellation policy?",
      answer: "All annual subscriptions and individual course purchases come with a 30-day no-questions-asked money-back guarantee. You can cancel your subscription at any time with a single click from your profile settings."
    }
  ]
};

// Export to window for global access across scripts
if (typeof window !== "undefined") {
  window.ATLAS_DATA = ATLAS_DATA;
}
