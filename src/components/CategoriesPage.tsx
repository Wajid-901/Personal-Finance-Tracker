import React from 'react';
import { useApp } from '../modules/state/AppProvider';
import { Category } from '../modules/state/types';
import { Plus, Trash2, Save, Tag, Home, Utensils, Gamepad2, Plane, Folder, Car, ShoppingCart, Heart, Star, Zap, Shield, Camera, Music, Book, Coffee, Gift } from 'lucide-react';

const iconMap = {
    Tag, Home, Utensils, Gamepad2, Plane, Folder, Car, ShoppingCart, Heart, Star, Zap, Shield, Camera, Music, Book, Coffee, Gift
};

export const CategoriesPage: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useApp();
    const [draft, setDraft] = React.useState<{ name: string; color: string; icon: string }>({ name: '', color: '#60a5fa', icon: 'Tag' });

    const IconSelect = () => (
        <select value={draft.icon} onChange={(e)=>setDraft({ ...draft, icon: e.target.value })} className="select">
            {Object.entries(iconMap).map(([key, Icon]) => (
                <option key={key} value={key}>{key}</option>
            ))}
        </select>
    );

    const getIcon = (iconName: string) => {
        const Icon = iconMap[iconName as keyof typeof iconMap] || Tag;
        return <Icon className="h-4 w-4" />;
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <div className="card p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <input placeholder="Name" value={draft.name} onChange={(e)=>setDraft({ ...draft, name: e.target.value })} className="input" />
                <input type="color" value={draft.color} onChange={(e)=>setDraft({ ...draft, color: e.target.value })} className="h-10 rounded-lg border border-slate-200/40 dark:border-slate-800/60" />
                <IconSelect />
                <button onClick={()=>{ if(!draft.name.trim()) return; addCategory(draft); setDraft({ name:'', color:'#60a5fa', icon:'Tag' }); }} className="btn-primary rounded-xl"><Plus className="h-4 w-4"/>Add</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c)=> (
                    <div key={c.id} className="card p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="h-4 w-4 rounded" style={{ background: c.color }} />
                                {getIcon(c.icon)}
                                <span className="font-medium">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={()=>{
                                    const name = prompt('Rename category', c.name) ?? c.name;
                                    const color = prompt('Change color (hex)', c.color) ?? c.color;
                                    updateCategory({ ...c, name, color });
                                }} className="btn-ghost rounded-lg"><Save className="h-4 w-4"/></button>
                                <button onClick={()=>deleteCategory(c.id)} className="btn-ghost rounded-lg text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4"/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


