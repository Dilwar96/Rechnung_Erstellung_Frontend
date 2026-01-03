import React from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date';
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    </div>
  );
};