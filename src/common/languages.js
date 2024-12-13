import flagus from '../../public/images/flags/us.svg';
import flagspain from '../../public/images/flags/spain.svg';
import flaggermany from '../../public/images/flags/germany.svg';
import flagitaly from '../../public/images/flags/italy.svg';
import flagrussia from '../../public/images/flags/russia.svg';
import flagchina from '../../public/images/flags/china.svg';
import flagfrench from '../../public/images/flags/french.svg';
import flagarabic from '../../public/images/flags/ar.svg';

const languages = {
  sp: {
    label: 'Española',
    flag: flagspain,
  },
  gr: {
    label: 'Deutsche',
    flag: flaggermany,
  },
  it: {
    label: 'Italiana',
    flag: flagitaly,
  },
  rs: {
    label: 'русский',
    flag: flagrussia,
  },
  en: {
    label: 'English',
    flag: flagus,
  },
  cn: {
    label: '中国人',
    flag: flagchina,
  },
  fr: {
    label: 'français',
    flag: flagfrench,
  },
  ar: {
    label: 'Arabic',
    flag: flagarabic,
  },
};

export default languages;
