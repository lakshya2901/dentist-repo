/**
 * ============================================================
 *  CLINIC CONFIG — edit everything about your site in here.
 * ============================================================
 * Anything in [SQUARE BRACKETS] is a PLACEHOLDER. Replace it with real,
 * verified information. Do not publish credentials, awards, statistics or
 * reviews that are not true and that you do not have permission to use.
 *
 * This file must stay plain JavaScript (no imports) because it is also read by
 * the build step to produce the static HTML.
 */

export const config = {
  /** 'dentist' or 'eye'. Switches copy, colours and the 3D scene. */
  specialty: 'dentist',

  clinic: {
    name: '[CLINIC NAME]',
    city: '[CITY]',
    phone: '[PHONE NUMBER]', // text shown on the page
    phoneHref: 'tel:+10000000000', // used by the Call buttons (digits only after +)
    whatsappNumber: '10000000000', // international format, digits only
    whatsappMessage: 'Hello, I would like to book an appointment.',
    email: 'hello@example.com',
    address: '[STREET ADDRESS], [CITY], [POSTAL CODE]',
    siteUrl: 'https://example.com', // used for canonical + Open Graph URLs
    /** Paste a Google Maps "Embed a map" src URL here. Empty = placeholder box. */
    mapEmbedUrl: '',
    hours: [
      { days: 'Monday – Friday', time: '[00:00 – 00:00]' },
      { days: 'Saturday', time: '[00:00 – 00:00]' },
      { days: 'Sunday', time: '[Closed / hours]' },
    ],
    socials: [
      { name: 'Facebook', url: '#' },
      { name: 'Instagram', url: '#' },
      { name: 'YouTube', url: '#' },
    ],
  },

  doctor: {
    name: 'Dr. [NAME]',
    /** Path or URL to a portrait. Leave empty to show the placeholder graphic. */
    photo: '',
    photoAlt: 'Portrait of Dr. [NAME] (placeholder)',
    qualifications: [
      '[DEGREE / QUALIFICATION — add yours]',
      '[TRAINING / FELLOWSHIP — add yours]',
      '[PROFESSIONAL REGISTRATION NUMBER]',
      '[MEMBERSHIPS — add yours]',
    ],
    bio: [
      '[PLACEHOLDER BIO] Dr. [NAME] leads [CLINIC NAME] in [CITY]. Write two or three sentences here about their approach to patient care, areas of interest and what patients can expect.',
      '[PLACEHOLDER] Add a sentence about languages spoken, community involvement or anything that helps new patients feel at ease.',
    ],
  },

  /**
   * Booking form. Leave `endpoint` empty during development (the form just
   * logs to the console and shows the success screen). See
   * src/sections/booking.js → sendBooking() to connect a real API / email service.
   */
  booking: {
    endpoint: '',
  },

  /** 3D settings. Set `gltfUrl` (e.g. '/models/tooth.glb') to replace the procedural hero model. */
  scene: {
    gltfUrl: '',
  },

  /** Clearly-marked placeholder figures. Replace with real numbers, or delete the item. */
  stats: [
    { value: 15, suffix: '+', label: 'Years of experience', placeholder: true },
    { value: 5000, suffix: '+', label: 'Patients cared for', placeholder: true },
    { value: 98, suffix: '%', label: 'Patient satisfaction', placeholder: true },
    { value: 12, suffix: '', label: 'Team members', placeholder: true },
  ],

  /** Placeholder reviews. Only publish real reviews you have permission to use. */
  testimonials: [
    {
      quote:
        '[PLACEHOLDER REVIEW] Replace this text with a genuine patient review that you have written permission to publish.',
      name: '[Patient Name]',
      detail: '[Treatment / date]',
    },
    {
      quote:
        '[PLACEHOLDER REVIEW] A second review goes here. Keep it honest and avoid medical guarantees or outcome promises.',
      name: '[Patient Name]',
      detail: '[Treatment / date]',
    },
    {
      quote:
        '[PLACEHOLDER REVIEW] A third review goes here. Delete unused slides by removing the object from this list.',
      name: '[Patient Name]',
      detail: '[Treatment / date]',
    },
  ],

  /** Copy that differs per specialty. Edit the block matching `specialty`. */
  content: {
    dentist: {
      metaTitle: '[CLINIC NAME] | Dentist in [CITY] — Dr. [NAME]',
      metaDescription:
        'Gentle, modern dental care in [CITY] with Dr. [NAME]. Check-ups, whitening, implants, braces and more. Book your appointment online.',
      doctorRole: 'Dentist',
      hero: {
        eyebrow: 'Dental care in [CITY]',
        title: 'Calm, careful dentistry for a smile you can trust.',
        subtitle:
          'Modern, gentle dental care from Dr. [NAME] and the [CLINIC NAME] team — explained clearly, at a pace that suits you.',
      },
      servicesIntro: {
        title: 'Care that protects your smile',
        text: 'From routine check-ups to cosmetic treatments, here is what we offer. Your dentist will recommend what is right for you.',
      },
      services: [
        { icon: 'clipboard', title: 'Check-ups & cleaning', text: 'Routine examinations and professional cleaning to help keep teeth and gums healthy.' },
        { icon: 'sparkle', title: 'Teeth whitening', text: 'Professional whitening options to brighten your smile, suited to your teeth.' },
        { icon: 'implant', title: 'Dental implants', text: 'Replacement of missing teeth with implant-supported options, planned step by step.' },
        { icon: 'braces', title: 'Braces & aligners', text: 'Orthodontic options to help straighten teeth and improve how they fit together.' },
        { icon: 'root', title: 'Root canal treatment', text: 'Treatment designed to relieve pain and save a badly infected or damaged tooth.' },
        { icon: 'tooth', title: 'Cosmetic dentistry', text: 'Veneers, bonding and smile design to refine the look of your teeth.' },
      ],
      whyTitle: 'Why patients choose us',
      whyText: 'A few reasons our patients feel at ease. (Figures below are placeholders.)',
      process: {
        title: 'Your visit, step by step',
        steps: [
          { title: 'Book online or call', text: 'Choose a time that suits you. We will confirm by phone or email.' },
          { title: 'Consultation & check-up', text: 'We listen, examine your teeth and gums, and discuss any concerns.' },
          { title: 'Your personal plan', text: 'You receive a clear plan with options and costs before anything begins.' },
          { title: 'Treatment, gently', text: 'Treatment is carried out with your comfort in mind, with regular check-ins.' },
          { title: 'Aftercare & follow-up', text: 'Advice for home care and reminders for your next visit.' },
        ],
      },
      faqs: [
        { q: 'How often should I visit the dentist?', a: 'Many people are advised to have a check-up every six to twelve months, but your dentist will recommend a schedule based on your needs. [CONFIRM WITH DR. NAME]' },
        { q: 'Is treatment painful?', a: 'We aim to keep you comfortable. Local anaesthetic and gentle techniques are used where appropriate, and you can ask to pause at any time. [EDIT TO MATCH YOUR PRACTICE]' },
        { q: 'Do you see children?', a: '[PLACEHOLDER] Add whether you treat children and from what age.' },
        { q: 'What should I bring to my first visit?', a: 'Please bring a photo ID, any relevant medical history or medication list, and previous dental records or X-rays if you have them.' },
        { q: 'How much will treatment cost?', a: 'Costs depend on the treatment. You will receive a written estimate before any work begins. [ADD PAYMENT / INSURANCE INFORMATION]' },
        { q: 'What if I need to cancel or reschedule?', a: '[PLACEHOLDER] Add your cancellation policy, e.g. notice period required.' },
      ],
    },

    eye: {
      metaTitle: '[CLINIC NAME] | Eye Specialist in [CITY] — Dr. [NAME]',
      metaDescription:
        'Comprehensive eye care in [CITY] with Dr. [NAME], ophthalmologist. Eye exams, cataract assessment, vision correction and more. Book online.',
      doctorRole: 'Ophthalmologist (eye specialist)',
      hero: {
        eyebrow: 'Eye care in [CITY]',
        title: 'Clear, careful eye care for every stage of life.',
        subtitle:
          'Comprehensive eye examinations and treatment from Dr. [NAME] and the [CLINIC NAME] team — explained clearly, with time for your questions.',
      },
      servicesIntro: {
        title: 'Care for your eyes, from every angle',
        text: 'From routine eye tests to surgical assessments, here is what we offer. Your eye specialist will advise what is right for you.',
      },
      services: [
        { icon: 'eye', title: 'Comprehensive eye exams', text: 'Thorough testing of vision and eye health, for adults and children.' },
        { icon: 'lens', title: 'Cataract assessment & surgery', text: 'Evaluation of cloudy lenses and discussion of treatment options.' },
        { icon: 'laser', title: 'LASIK & vision correction', text: 'Assessment for laser vision correction and other options to reduce reliance on glasses.' },
        { icon: 'retina', title: 'Glaucoma & retina care', text: 'Screening and monitoring of conditions that affect the optic nerve and retina.' },
        { icon: 'drop', title: 'Dry eye treatment', text: 'Identifying causes of irritation and discomfort, with tailored management plans.' },
        { icon: 'glasses', title: 'Glasses & contact lenses', text: 'Prescriptions and fittings for glasses and contact lenses.' },
      ],
      whyTitle: 'Why patients choose us',
      whyText: 'A few reasons our patients feel at ease. (Figures below are placeholders.)',
      process: {
        title: 'Your visit, step by step',
        steps: [
          { title: 'Book online or call', text: 'Choose a time that suits you. We will confirm by phone or email.' },
          { title: 'History & vision tests', text: 'We review your history and carry out vision and eye-health tests.' },
          { title: 'Examination & diagnosis', text: 'Dr. [NAME] examines your eyes and explains the findings in plain language.' },
          { title: 'Your personal plan', text: 'You receive clear options, including any treatment, with costs up front.' },
          { title: 'Follow-up care', text: 'Aftercare guidance and scheduled reviews where needed.' },
        ],
      },
      faqs: [
        { q: 'How often should I have my eyes tested?', a: 'This varies with age and health. Many adults are advised to have an eye exam every one to two years. [CONFIRM WITH DR. NAME]' },
        { q: 'Will my eyes be dilated?', a: 'Sometimes drops are used to widen the pupils for a better view inside the eye. Vision may be blurry and light-sensitive for a few hours, so you may want someone to accompany you. [EDIT TO MATCH YOUR PRACTICE]' },
        { q: 'Do you see children?', a: '[PLACEHOLDER] Add whether you examine children and from what age.' },
        { q: 'What should I bring to my first visit?', a: 'Please bring your current glasses or contact lenses, a list of any medications, and previous eye records if you have them.' },
        { q: 'How much will treatment cost?', a: 'Costs depend on the examination or treatment. You will receive an estimate before any procedure. [ADD PAYMENT / INSURANCE INFORMATION]' },
        { q: 'What if I need to cancel or reschedule?', a: '[PLACEHOLDER] Add your cancellation policy, e.g. notice period required.' },
      ],
    },
  },

  disclaimer: 'Content is for information only and is not medical advice.',
};
