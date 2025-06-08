
export const countries = [
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'ES', name: 'Espanha', dialCode: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'França', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Itália', dialCode: '+39', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemanha', dialCode: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Austrália', dialCode: '+61', flag: '🇦🇺' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colômbia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguai', dialCode: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguai', dialCode: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolívia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'EC', name: 'Equador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'NI', name: 'Nicarágua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1809', flag: '🇩🇴' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'JP', name: 'Japão', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Coreia do Sul', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'Índia', dialCode: '+91', flag: '🇮🇳' },
  { code: 'RU', name: 'Rússia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'ZA', name: 'África do Sul', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigéria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'EG', name: 'Egito', dialCode: '+20', flag: '🇪🇬' },
  { code: 'MA', name: 'Marrocos', dialCode: '+212', flag: '🇲🇦' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'MZ', name: 'Moçambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'GW', name: 'Guiné-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'ST', name: 'São Tomé e Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱' }
];

export const detectUserCountry = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language;
    
    // Detectar por timezone
    if (timezone.includes('Lisbon') || timezone.includes('Porto')) return 'PT';
    if (timezone.includes('Sao_Paulo') || timezone.includes('Brasilia')) return 'BR';
    if (timezone.includes('Madrid')) return 'ES';
    if (timezone.includes('Paris')) return 'FR';
    if (timezone.includes('Rome')) return 'IT';
    if (timezone.includes('Berlin')) return 'DE';
    if (timezone.includes('London')) return 'GB';
    if (timezone.includes('New_York') || timezone.includes('Los_Angeles')) return 'US';
    
    // Detectar por locale
    if (locale.startsWith('pt-PT')) return 'PT';
    if (locale.startsWith('pt-BR')) return 'BR';
    if (locale.startsWith('es')) return 'ES';
    if (locale.startsWith('fr')) return 'FR';
    if (locale.startsWith('it')) return 'IT';
    if (locale.startsWith('de')) return 'DE';
    if (locale.startsWith('en-GB')) return 'GB';
    if (locale.startsWith('en-US')) return 'US';
    
    return 'PT'; // Default para Portugal
  } catch {
    return 'PT';
  }
};
