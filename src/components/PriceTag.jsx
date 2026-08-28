import { formatPrice } from '../utils/formatPrice';

export default function PriceTag({ value, size = 'md' }) {
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <span className={`font-mono font-semibold text-walnut ${sizes[size]}`}>
      {formatPrice(value)}
    </span>
  );
}
