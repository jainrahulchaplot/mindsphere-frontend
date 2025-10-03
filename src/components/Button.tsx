type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'premium' | 'white';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ 
  label, 
  onClick, 
  className, 
  disabled, 
  type, 
  isLoading, 
  variant = 'primary',
  size = 'md'
}: Props) {
  const baseClasses = 'relative overflow-hidden font-semibold transition-all duration-300 active:scale-95';
  
  const variantClasses = {
    primary: 'btn',
    secondary: 'btn bg-white/5 border-white/20 text-white/80 hover:bg-white/10',
    premium: 'btn-premium text-white font-bold',
    white: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-semibold'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const loadingClasses = isLoading ? 'relative' : '';

  return (
    <button 
      onClick={onClick} 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${disabledClasses} 
        ${loadingClasses} 
        ${className || ''}
      `}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <span className={`${isLoading ? 'opacity-0' : ''} relative z-10`}>
        {label}
      </span>
    </button>
  );
}