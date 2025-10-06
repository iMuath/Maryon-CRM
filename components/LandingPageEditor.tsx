import React, { useState, useEffect } from 'react';
import { X, Save, Square, Image as ImageIcon, List, Mail } from 'lucide-react';
import type { LandingPage, LandingPageBlock, LandingPageBlockType } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LandingPagePropertiesPanel } from './LandingPagePropertiesPanel';

interface LandingPageEditorProps {
    page: LandingPage | 'new' | null;
    onSave: (page: LandingPage) => void;
    onClose: () => void;
}

const COMPONENT_LIST: { type: LandingPageBlockType, labelKey: string, icon: React.ElementType }[] = [
    { type: 'hero', labelKey: 'hero_section', icon: Square },
    { type: 'gallery', labelKey: 'image_gallery', icon: ImageIcon },
    { type: 'features', labelKey: 'feature_list', icon: List },
    { type: 'contact_form', labelKey: 'contact_form', icon: Mail },
];

const createNewBlock = (type: LandingPageBlockType): LandingPageBlock => {
    const id = `blk_${Date.now()}`;
    switch (type) {
        case 'hero':
            return { id, type, title: 'Headline Title', subtitle: 'Supporting subtitle text.', imageUrl: 'https://picsum.photos/seed/hero/1200/600', buttonText: 'Call to Action' };
        case 'gallery':
            return { id, type, title: 'Image Gallery', images: [{id: 'img1', url: 'https://picsum.photos/seed/gallery1/800/600', alt: 'Placeholder 1'}, {id: 'img2', url: 'https://picsum.photos/seed/gallery2/800/600', alt: 'Placeholder 2'}] };
        case 'features':
            return { id, type, title: 'Key Features', features: [{id: 'feat1', icon: 'Bed', title: 'Bedrooms', description: '3'}, {id: 'feat2', icon: 'Bath', title: 'Bathrooms', description: '2'}, {id: 'feat3', icon: 'Area', title: 'Area', description: '250m²'}] };
        case 'contact_form':
            return { id, type, title: 'Contact Us', buttonText: 'Submit Inquiry' };
    }
}

const BlockPreview: React.FC<{ block: LandingPageBlock, isSelected: boolean, onClick: () => void }> = ({ block, isSelected, onClick }) => {
    const borderClass = isSelected ? 'border-maryon-accent' : 'border-transparent hover:border-maryon-accent/50';
    return (
        <div onClick={onClick} className={`p-4 border-2 ${borderClass} cursor-pointer transition-colors my-2 bg-maryon-surface`}>
            {block.type === 'hero' && <div className="text-center"><h2 className="text-2xl font-bold">{block.title}</h2><p>{block.subtitle}</p></div>}
            {block.type === 'gallery' && <div><h3 className="font-semibold text-lg">{block.title}</h3><p className="text-sm">{block.images.length} images</p></div>}
            {block.type === 'features' && <div><h3 className="font-semibold text-lg">{block.title}</h3><p className="text-sm">{block.features.length} features</p></div>}
            {block.type === 'contact_form' && <div className="text-center"><h3 className="font-semibold text-lg">{block.title}</h3><Button>{block.buttonText}</Button></div>}
        </div>
    );
}

export const LandingPageEditor: React.FC<LandingPageEditorProps> = ({ page, onSave, onClose }) => {
    const { t } = useLocalization();
    const [pageData, setPageData] = useState<Omit<LandingPage, 'id' | 'createdAt'>>({ title: '', status: 'Draft', content: [] });
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    useEffect(() => {
        if (page && page !== 'new') {
            setPageData({ title: page.title, status: page.status, content: page.content });
        } else {
             setPageData({ title: 'New Landing Page', status: 'Draft', content: [] });
        }
    }, [page]);

    const handleSave = () => {
        const finalPageData = { ...pageData, id: (page !== 'new' && page?.id) || '', createdAt: (page !== 'new' && page?.createdAt) || new Date().toISOString().split('T')[0] };
        onSave(finalPageData);
    };

    const handleBlockUpdate = (updatedBlock: LandingPageBlock) => {
        setPageData(prev => ({
            ...prev,
            content: prev.content.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        }));
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: LandingPageBlockType) => {
        e.dataTransfer.setData('blockType', type);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const blockType = e.dataTransfer.getData('blockType') as LandingPageBlockType;
        if (blockType) {
            const newBlock = createNewBlock(blockType);
            setPageData(prev => ({...prev, content: [...prev.content, newBlock]}));
            setSelectedBlockId(newBlock.id);
        }
    };
    
    const selectedBlock = pageData.content.find(b => b.id === selectedBlockId) || null;

    return (
        <div className="fixed inset-0 bg-maryon-background flex flex-col h-screen">
            {/* Header */}
            <header className="flex-shrink-0 bg-maryon-surface border-b border-maryon-border flex items-center justify-between p-4 h-20">
                <h1 className="text-xl font-bold text-maryon-text-primary">{t('landing_page_editor')}</h1>
                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={onClose}><X className="w-5 h-5 me-2" />{t('close')}</Button>
                    <Button onClick={handleSave}><Save className="w-5 h-5 me-2" />{t('save')}</Button>
                </div>
            </header>
            
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Components */}
                <aside className="w-72 bg-maryon-surface border-e border-maryon-border p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">{t('components')}</h2>
                    <div className="space-y-2">
                        {COMPONENT_LIST.map(comp => (
                            <div key={comp.type} draggable onDragStart={(e) => handleDragStart(e, comp.type)} className="flex items-center p-3 border border-maryon-border rounded-lg cursor-grab active:cursor-grabbing hover:bg-maryon-hover">
                                <comp.icon className="w-5 h-5 me-3 text-maryon-text-secondary" />
                                <span className="font-medium">{t(comp.labelKey)}</span>
                            </div>
                        ))}
                    </div>
                </aside>
                
                {/* Center Panel: Canvas */}
                <main className="flex-1 overflow-y-auto p-8" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                    <div className="max-w-4xl mx-auto">
                       <Input id="pageTitle" label={t('page_title')} value={pageData.title} onChange={e => setPageData(p => ({...p, title: e.target.value}))} className="text-2xl font-bold mb-8 p-2 !bg-transparent border-0 border-b-2 rounded-none focus:ring-0" />
                        
                        {pageData.content.length > 0 ? (
                           pageData.content.map(block => (
                               <BlockPreview key={block.id} block={block} isSelected={selectedBlockId === block.id} onClick={() => setSelectedBlockId(block.id)} />
                           ))
                        ) : (
                            <div className="text-center border-2 border-dashed border-maryon-border rounded-lg py-24 text-maryon-text-secondary">
                                {t('drag_component')}
                            </div>
                        )}
                    </div>
                </main>
                
                {/* Right Panel: Properties */}
                <aside className="w-96 bg-maryon-surface border-s border-maryon-border p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">{t('properties')}</h2>
                    {selectedBlock ? (
                        <LandingPagePropertiesPanel block={selectedBlock} onChange={handleBlockUpdate} />
                    ) : (
                        <div className="text-center text-maryon-text-muted mt-8">Select a component to edit its properties.</div>
                    )}
                </aside>
            </div>
        </div>
    );
};