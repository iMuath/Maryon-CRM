import React, { useState } from 'react';
import type { LandingPageBlock } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Select } from './ui/Select';
import { GoogleGenAI } from '@google/genai';

interface AiTextInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    generationContext: string; // e.g. "a hero section title"
}

const AiTextInput: React.FC<AiTextInputProps> = ({ id, label, value, onChange, generationContext }) => {
    const { t } = useLocalization();
    const [showPrompt, setShowPrompt] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Generate a short, compelling piece of text for ${generationContext} for a Saudi Arabian real estate website. The user's prompt is: "${prompt}". Return only the text.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            onChange(response.text.replace(/"/g, ''));
            setShowPrompt(false);
            setPrompt('');
        } catch (error) {
            console.error("AI generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label htmlFor={id} className="block text-sm font-medium text-maryon-text-secondary">
                    {label}
                </label>
                <button type="button" onClick={() => setShowPrompt(!showPrompt)} className="p-1 text-maryon-accent hover:bg-maryon-hover rounded-full">
                    <Sparkles className="w-4 h-4" />
                </button>
            </div>
            <Input id={id} name={id} value={value} onChange={e => onChange(e.target.value)} className="!mt-0" />
            {showPrompt && (
                <div className="flex gap-2">
                    <Input id={`${id}-prompt`} name={`${id}-prompt`} label="" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('ai_prompt_placeholder')} />
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating}>{t('generate')}</Button>
                </div>
            )}
        </div>
    );
};


interface LandingPagePropertiesPanelProps {
    block: LandingPageBlock;
    onChange: (updatedBlock: LandingPageBlock) => void;
}

const HeroPanel: React.FC<{ block: any; onChange: (b: any) => void; t: (k: string) => string }> = ({ block, onChange, t }) => (
    <div className="space-y-4">
        <AiTextInput id="title" label={t('main_title')} value={block.title} onChange={val => onChange({ ...block, title: val })} generationContext="a main title for a hero section" />
        <AiTextInput id="subtitle" label={t('subtitle')} value={block.subtitle} onChange={val => onChange({ ...block, subtitle: val })} generationContext="a subtitle for a hero section" />
        <Input id="imageUrl" label={t('image_url')} value={block.imageUrl} onChange={e => onChange({ ...block, imageUrl: e.target.value })} />
        <AiTextInput id="buttonText" label={t('button_text')} value={block.buttonText} onChange={val => onChange({ ...block, buttonText: val })} generationContext="a call-to-action button text" />
    </div>
);

const GalleryPanel: React.FC<{ block: any; onChange: (b: any) => void; t: (k: string) => string }> = ({ block, onChange, t }) => {
    const handleImageChange = (index: number, field: string, value: string) => {
        const newImages = [...block.images];
        newImages[index] = { ...newImages[index], [field]: value };
        onChange({ ...block, images: newImages });
    };

    const addImage = () => {
        const newImage = { id: `img_${Date.now()}`, url: 'https://picsum.photos/800/600', alt: 'New Image' };
        onChange({ ...block, images: [...block.images, newImage] });
    };
    
    const removeImage = (index: number) => {
        const newImages = block.images.filter((_:any, i:number) => i !== index);
        onChange({ ...block, images: newImages });
    };

    return (
        <div className="space-y-4">
            <Input id="title" label={t('title')} value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} />
            {block.images.map((img: any, index: number) => (
                <div key={img.id} className="p-3 border border-maryon-border rounded-lg space-y-2 relative">
                    <button onClick={() => removeImage(index)} className="absolute top-2 end-2 p-1 text-red-500 hover:bg-red-500/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    <Input id={`img-url-${index}`} label={`Image ${index + 1} URL`} value={img.url} onChange={e => handleImageChange(index, 'url', e.target.value)} />
                    <Input id={`img-alt-${index}`} label={`Alt Text ${index + 1}`} value={img.alt} onChange={e => handleImageChange(index, 'alt', e.target.value)} />
                </div>
            ))}
            <Button variant="secondary" onClick={addImage}><Plus className="w-4 h-4 me-2" />{t('add_image')}</Button>
        </div>
    );
};

const FeaturesPanel: React.FC<{ block: any; onChange: (b: any) => void; t: (k: string) => string }> = ({ block, onChange, t }) => {
    const handleFeatureChange = (index: number, field: string, value: string) => {
        const newFeatures = [...block.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        onChange({ ...block, features: newFeatures });
    };

    const addFeature = () => {
        const newFeature = { id: `feat_${Date.now()}`, icon: 'Star', title: 'New Feature', description: 'Description' };
        onChange({ ...block, features: [...block.features, newFeature] });
    };
    
    const removeFeature = (index: number) => {
        const newFeatures = block.features.filter((_:any, i:number) => i !== index);
        onChange({ ...block, features: newFeatures });
    };

    return (
        <div className="space-y-4">
            <Input id="title" label={t('title')} value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} />
            {block.features.map((feat: any, index: number) => (
                <div key={feat.id} className="p-3 border border-maryon-border rounded-lg space-y-2 relative">
                     <button onClick={() => removeFeature(index)} className="absolute top-2 end-2 p-1 text-red-500 hover:bg-red-500/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    <Input id={`feat-title-${index}`} label={t('feature_title')} value={feat.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
                    <Select id={`feat-icon-${index}`} label={t('feature_icon')} value={feat.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)}>
                        <option>Bed</option>
                        <option>Bath</option>
                        <option>Area</option>
                        <option>Car</option>
                        <option>Pool</option>
                        <option>Star</option>
                    </Select>
                    <Input id={`feat-desc-${index}`} label={t('feature_description')} value={feat.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} />
                </div>
            ))}
            <Button variant="secondary" onClick={addFeature}><Plus className="w-4 h-4 me-2" />{t('add_feature')}</Button>
        </div>
    );
};

const ContactFormPanel: React.FC<{ block: any; onChange: (b: any) => void; t: (k: string) => string }> = ({ block, onChange, t }) => (
    <div className="space-y-4">
        <Input id="title" label={t('form_title')} value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} />
        <Input id="buttonText" label={t('button_text')} value={block.buttonText} onChange={e => onChange({ ...block, buttonText: e.target.value })} />
    </div>
);


export const LandingPagePropertiesPanel: React.FC<LandingPagePropertiesPanelProps> = ({ block, onChange }) => {
    const { t } = useLocalization();

    switch (block.type) {
        case 'hero':
            return <HeroPanel block={block} onChange={onChange} t={t} />;
        case 'gallery':
            return <GalleryPanel block={block} onChange={onChange} t={t} />;
        case 'features':
            return <FeaturesPanel block={block} onChange={onChange} t={t} />;
        case 'contact_form':
            return <ContactFormPanel block={block} onChange={onChange} t={t} />;
        default:
            return <div>Unknown block type</div>;
    }
};
