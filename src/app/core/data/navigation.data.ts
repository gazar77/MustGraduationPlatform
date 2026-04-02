export interface MenuItem {
  label: string;
  translationKey?: string; // Key for LanguageService
  externalUrl?: string; // For external MUST links
  routerLink?: string;  // For internal portal links
  isDirectLink?: boolean;
  hasMegaMenu?: boolean;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'The University',
    translationKey: 'university',
    externalUrl: 'https://must.edu.eg/',
    hasMegaMenu: true,
    children: [
      {
        label: 'About MUST',
        externalUrl: 'https://must.edu.eg/',
        children: [
          { label: 'Board of Trustees', externalUrl: 'https://must.edu.eg/about-must/board-of-trustees/' },
          { label: 'President', externalUrl: 'https://must.edu.eg/about-must/president/' },
          { label: 'Vision & Mission', externalUrl: 'https://must.edu.eg/about-must/vision-mission/' },
          { label: 'MUST Values & Principles', externalUrl: 'https://must.edu.eg/about-must/must-policies/' },
          { label: 'History', externalUrl: 'https://must.edu.eg/history/' }
        ]
      },
      {
        label: 'Sectors',
        externalUrl: 'https://must.edu.eg/',
        children: [
          {
            label: 'Environmental and Community Service Sector',
            externalUrl: 'https://must.edu.eg/sectors/environmental-and-community-service-sector/',
            children: [
              { label: 'Innovation and Entrepreneurship Center', externalUrl: 'https://must.edu.eg/centers/innovation-and-entrepreneurship-center/' },
              { label: 'Arab Heritage Authentication Center', externalUrl: 'https://must.edu.eg/centers/test/' },
              { label: 'Equal Opportunities & Gender Equality Unit', externalUrl: 'https://must.edu.eg/units/equal-opportunities-gender-equality-unit/' }
            ]
          },
          { label: 'Sustainability Sector', externalUrl: 'https://must.edu.eg/sustainability-office/' }
        ]
      },
      {
        label: 'Reports',
        externalUrl: 'https://must.edu.eg/reports/',
        children: [
          { label: 'Interdisciplinary Subjects', externalUrl: 'https://must.edu.eg/reports/interdisciplinary-science/' },
          { label: 'Financial Report', externalUrl: 'https://must.edu.eg/reports/financial-report/' }
        ]
      },
      {
        label: 'Policies',
        externalUrl: 'https://must.edu.eg/policies/',
        isDirectLink: true
      },
      {
        label: 'Univeristy Council Minutes',
        externalUrl: 'https://must.edu.eg/univeristy-council-minutes/',
        isDirectLink: true
      },
      {
        label: 'Quality Assurance and Accreditation Sector',
        externalUrl: 'https://must.edu.eg/sectors/quality-assurance-and-accreditation-sector/',
        isDirectLink: true
      },
      {
        label: 'Accreditation & Partnerships',
        externalUrl: 'https://must.edu.eg/?page_id=1660',
        isDirectLink: true
      },
      {
        label: 'Contact Us',
        externalUrl: 'https://must.edu.eg/contact/',
        isDirectLink: true
      },
      {
        label: 'Resources',
        externalUrl: 'https://must.edu.eg/',
        children: [
          { label: 'Smart E-Learning', externalUrl: 'https://must.edu.eg/smart-e-learning/' },
          { label: 'MUSTER', externalUrl: 'https://must.edu.eg/muster/' },
          { label: 'Digital Archive & Research Repository (MDAR)', externalUrl: 'http://dspace.must.edu.eg/' }
        ]
      }
    ]
  },
  {
    label: 'Academics',
    translationKey: 'academics',
    externalUrl: 'https://must.edu.eg/academics/',
    children: [
      { label: 'Undergraduate Studies', externalUrl: 'https://must.edu.eg/academic_programs/undergraduate-studies/' },
      { label: 'Post-Graduate Program', externalUrl: 'https://must.edu.eg/academic_programs/graduate-studies/' },
      { label: 'Academic Calendar', externalUrl: 'https://must.edu.eg/academic-calendar/' },
      { label: 'International Students Affairs Sector', externalUrl: 'https://must.edu.eg/sectors/international-students-affairs-sector/' }
    ]
  },
  {
    label: 'Admission',
    translationKey: 'admission',
    externalUrl: 'https://admission.must.edu.eg',
    isDirectLink: true
  },
  {
    label: 'MUST BUZZ',
    translationKey: 'buzz',
    externalUrl: 'https://must.edu.eg/',
    children: [
      { label: 'MUST Events', externalUrl: 'https://must.edu.eg/event/' },
      { label: 'MUST News', externalUrl: 'https://must.edu.eg/news/' },
      { label: 'MUST Blogs', externalUrl: 'https://must.edu.eg/blog/' },
      { label: 'Announcements', externalUrl: 'https://must.edu.eg/anouncement/' }
    ]
  },
  {
    label: 'Centers',
    translationKey: 'centers',
    externalUrl: 'https://must.edu.eg/centers/',
    children: [
      { label: 'Centers', externalUrl: 'https://must.edu.eg/centers/' },
      { label: 'Units', externalUrl: 'https://must.edu.eg/units/' },
      { label: 'Research Center for Public Opinion and Societal Issues Monitoring', externalUrl: 'https://must.edu.eg/sectors/research-center-for-public-opinion-and-societal-issues-monitoring/' }
    ]
  },
  {
    label: 'Life At MUST',
    translationKey: 'life',
    externalUrl: 'https://must.edu.eg/',
    children: [
      { label: 'MUST Life', externalUrl: 'https://must.edu.eg/must-life/' },
      { label: 'MUST Stars', externalUrl: 'https://must.edu.eg/stars/' },
      { label: 'MUST Clubs', externalUrl: 'https://must.edu.eg/clubs/' },
      { label: 'Facilities', externalUrl: 'https://must.edu.eg/facilities/' }
    ]
  },
  {
    label: 'SDGs',
    translationKey: 'sdgs',
    externalUrl: 'https://SDG.must.edu.eg/SDG',
    isDirectLink: true
  }
];
