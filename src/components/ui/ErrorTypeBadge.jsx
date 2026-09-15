import { ERROR_TYPES } from '../../data/mockData';

const CLASS_BY_TYPE = {
  omission: 'badge-danger',
  substitution: 'badge-primary',
  distortion: 'badge-warning',
  addition: 'badge-lavender',
};

export default function ErrorTypeBadge({ type }) {
  if (!type) {
    return <span className="badge badge-success">لا يوجد خطأ</span>;
  }
  const info = ERROR_TYPES[type];
  return <span className={`badge ${CLASS_BY_TYPE[type] || 'badge-neutral'}`}>{info ? info.label : type}</span>;
}
