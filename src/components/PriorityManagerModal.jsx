import React, { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';

const PRESET_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Green
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
];

export default function PriorityManagerModal({
    isOpen,
    onClose,
    priorities,
    onAddPriority,
    onDeletePriority,
}) {
    const [newLabel, setNewLabel] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[6]);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCreate = (e) => {
        e.preventDefault();
        const clean = newLabel.trim();
        if (!clean) {
            setError('Label cannot be empty');
            return;
        }
        if (priorities.some((p) => p.label.toLowerCase() === clean.toLowerCase())) {
            setError('A priority level with this name already exists');
            return;
        }

        onAddPriority({
            id: clean.toLowerCase().replace(/\s+/g, '-'),
            label: clean,
            color: selectedColor,
            isCustom: true,
        });

        setNewLabel('');
        setError('');
    };

    return (
        <div className="modal-backdrop">
            <div
                className="glass-island"
                style={{ width: '100%', maxWidth: '440px', padding: '24px', position: 'relative' }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                    }}
                >
                    <X size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div
                        style={{
                            padding: '8px',
                            borderRadius: '10px',
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: '#C084FC',
                        }}
                    >
                        <Tag size={18} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FAFAFA' }}>
                        Custom Priorities
                    </h2>
                </div>

                {/* Existing Priority Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', maxHeight: '180px', overflowY: 'auto' }}>
                    {priorities.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: p.color,
                                    }}
                                />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FAFAFA' }}>
                                    {p.label}
                                </span>
                            </div>
                            {p.isCustom && (
                                <button
                                    onClick={() => onDeletePriority(p.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#EF4444',
                                        cursor: 'pointer',
                                        opacity: 0.8,
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Create New Priority Form */}
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="New priority label (e.g. Deep Work)..."
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="custom-input"
                        style={{ padding: '10px 14px', fontSize: '13px' }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>COLOR:</span>
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    border: selectedColor === color ? '2px solid #FFFFFF' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                                }}
                            />
                        ))}
                    </div>

                    {error && <span style={{ color: '#EF4444', fontSize: '11px' }}>{error}</span>}

                    <button
                        type="submit"
                        className="btn-primary-gradient"
                        style={{
                            padding: '10px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            marginTop: '6px',
                        }}
                    >
                        <Plus size={15} />
                        <span>Add Priority Level</span>
                    </button>
                </form>
            </div>
        </div>
    );
}