import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Upload, Image, Video, Trash2, Copy, Film, Sparkles, Search, Pencil } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import { mockMediaAssets } from '../data/mockData';
import type { MediaAsset } from '../types';
import { Modal } from './ui/Modal';
import { GenerateVideoForm } from './GenerateVideoForm';
import { GenerateImageForm } from './GenerateImageForm';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { GoogleGenAI, Modality } from '@google/genai';

// Helper to convert a file URL (or any URL) to a base64 string and get its mime type
async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({ base64, mimeType });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


const AssetCard: React.FC<{ asset: MediaAsset; onDelete: (id: string) => void; onEdit: (asset: MediaAsset) => void }> = ({ asset, onDelete, onEdit }) => {
    const { t } = useLocalization();
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(asset.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group overflow-hidden rounded-lg border border-maryon-border bg-maryon-surface">
            <div className="aspect-w-16 aspect-h-9 bg-maryon-hover flex items-center justify-center">
                {asset.type === 'image' ? (
                    <img src={asset.url} alt={asset.name} className="object-cover w-full h-full" />
                ) : (
                    <Video className="w-12 h-12 text-maryon-text-muted" />
                )}
            </div>
            <div className="p-4">
                <p className="font-semibold text-sm truncate text-maryon-text-primary">{asset.name}</p>
                <p className="text-xs text-maryon-text-secondary">{asset.createdAt}</p>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2" title={t('copy_url')} onClick={handleCopyUrl}>
                    {copied ? t('copied') : <Copy className="w-5 h-5" />}
                </Button>
                {asset.type === 'image' && (
                     <Button variant="ghost" className="text-white hover:bg-white/20 p-2" title={t('edit_with_ai')} onClick={() => onEdit(asset)}>
                        <Pencil className="w-5 h-5" />
                    </Button>
                )}
                <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-red-400 p-2" title={t('delete')} onClick={() => onDelete(asset.id)}>
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

const ImageEditorModal: React.FC<{
    asset: MediaAsset | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (originalAssetId: string, newImageUrl: string, newImageName: string) => void;
}> = ({ asset, isOpen, onClose, onSave }) => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setPrompt('');
            setEditedImageUrl(null);
            setIsGenerating(false);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        if (!asset || !prompt) return;
        setIsGenerating(true);
        setEditedImageUrl(null);
        try {
            const { base64, mimeType } = await urlToBase64(asset.url);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64, mimeType } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            
            const imagePart = response.candidates?.[0].content.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                const newMimeType = imagePart.inlineData.mimeType;
                const newBase64 = imagePart.inlineData.data;
                setEditedImageUrl(`data:${newMimeType};base64,${newBase64}`);
            }

        } catch (error) {
            console.error("Error editing image:", error);
            alert("Failed to edit image.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSave = () => {
        if (asset && editedImageUrl) {
            const newName = `${prompt.substring(0, 20).replace(/\s/g, '_')}_${asset.name}`;
            onSave(asset.id, editedImageUrl, newName);
            onClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('edit_image')}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <label className="block text-sm font-medium text-maryon-text-secondary mb-2">Original</label>
                        <img src={asset?.url} alt={asset?.name} className="rounded-lg w-full object-contain border border-maryon-border" />
                    </div>
                     <div className="text-center">
                        <label className="block text-sm font-medium text-maryon-text-secondary mb-2">Edited</label>
                        <div className="rounded-lg w-full aspect-square border border-maryon-border bg-maryon-hover flex items-center justify-center">
                            {isGenerating ? <Sparkles className="w-8 h-8 text-maryon-accent animate-spin" /> : 
                             editedImageUrl ? <img src={editedImageUrl} className="rounded-lg w-full object-contain" /> : <Image className="w-8 h-8 text-maryon-text-muted" />}
                        </div>
                    </div>
                </div>
                <Input 
                    id="edit-prompt"
                    label={t('edit_prompt')}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder={t('edit_prompt_placeholder')}
                />
                 <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isGenerating}>
                      {t('cancel')}
                    </Button>
                    <Button type="button" onClick={handleGenerate} disabled={isGenerating || !prompt}>
                      {isGenerating ? t('generating') : t('generate')}
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isGenerating || !editedImageUrl}>
                      {t('save')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


export const MediaLibrary: React.FC = () => {
    const { t } = useLocalization();
    const [assets, setAssets] = useState<MediaAsset[]>(mockMediaAssets);
    const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState({ image: false, video: false });
    const [videoStatus, setVideoStatus] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
    
    const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            if (filter !== 'all' && asset.type !== filter) return false;
            if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (dateFilter.from) {
                const fromDate = new Date(dateFilter.from);
                fromDate.setHours(0, 0, 0, 0);
                if (new Date(asset.createdAt) < fromDate) return false;
            }
            if (dateFilter.to) {
                const toDate = new Date(dateFilter.to);
                toDate.setHours(23, 59, 59, 999);
                if (new Date(asset.createdAt) > toDate) return false;
            }
            if (sizeFilter !== 'all') {
                const sizeInBytes = asset.size;
                const MB = 1048576;
                if (sizeFilter === 'small' && sizeInBytes >= MB) return false;
                if (sizeFilter === 'medium' && (sizeInBytes < MB || sizeInBytes > 10 * MB)) return false;
                if (sizeFilter === 'large' && sizeInBytes <= 10 * MB) return false;
            }
            return true;
        });
    }, [assets, filter, searchQuery, dateFilter, sizeFilter]);

    const handleDelete = (id: string) => {
        setAssets(currentAssets => currentAssets.filter(asset => asset.id !== id));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Fix: Explicitly type `file` as `File` to resolve properties not existing on 'unknown' type.
        const newAssets: MediaAsset[] = Array.from(files).map((file: File, index) => ({
            id: `MA${(assets.length + index + 1).toString().padStart(3, '0')}`,
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: URL.createObjectURL(file),
            createdAt: new Date().toISOString().split('T')[0],
            size: file.size,
        }));

        setAssets(prevAssets => [...newAssets, ...prevAssets]);
    };

    const triggerFileInput = () => {
        document.getElementById('media-upload-input')?.click();
    };
    
    const handleGenerateImage = async (data: { prompt: string; aspectRatio: string }) => {
        setIsGenerating(p => ({...p, image: true}));
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: data.prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: "1:1" }
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            const newImageAsset: MediaAsset = {
                id: `MA${(assets.length + 1).toString().padStart(3, '0')}`,
                name: `${data.prompt.substring(0, 20).replace(/\s/g, '_')}.jpg`,
                type: 'image',
                url: imageUrl,
                createdAt: new Date().toISOString().split('T')[0],
                size: atob(base64ImageBytes).length,
            };
            setAssets(prevAssets => [newImageAsset, ...prevAssets]);
            setIsImageModalOpen(false);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("Failed to generate image. Check the console for details.");
        } finally {
            setIsGenerating(p => ({...p, image: false}));
        }
    };

    const handleGenerateVideo = async (data: { prompt: string }) => {
        setIsGenerating(p => ({...p, video: true}));
        setVideoStatus(t('video_generating_message'));
        setIsVideoModalOpen(false);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: data.prompt,
                config: { numberOfVideos: 1 }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                 const videoBlob = await response.blob();
                 const videoUrl = URL.createObjectURL(videoBlob);
                 const newVideoAsset: MediaAsset = {
                    id: `MA${(assets.length + 1).toString().padStart(3, '0')}`,
                    name: `${data.prompt.split(' ').join('-')}.mp4`,
                    type: 'video',
                    url: videoUrl,
                    createdAt: new Date().toISOString().split('T')[0],
                    size: videoBlob.size,
                };
                setAssets(prevAssets => [newVideoAsset, ...prevAssets]);
            } else {
                 throw new Error("Video generation completed but no download link found.");
            }
        } catch (error) {
            console.error("Error generating video:", error);
            alert("Failed to generate video. Please try again.");
        } finally {
            setIsGenerating(p => ({...p, video: false}));
            setVideoStatus('');
        }
    };
    
    const handleEditImage = (asset: MediaAsset) => {
        setEditingAsset(asset);
    }
    
    const handleSaveEditedImage = (originalAssetId: string, newImageUrl: string, newImageName: string) => {
        const newAsset: MediaAsset = {
            id: `MA_edit_${Date.now()}`,
            name: newImageName,
            type: 'image',
            url: newImageUrl,
            createdAt: new Date().toISOString().split('T')[0],
            size: 0, // Size is not easily determined from data URL without more logic
        }
        setAssets(prev => [newAsset, ...prev]);
        setEditingAsset(null);
    }


    const filterButtons = [
        { id: 'all', label: t('all_media'), icon: null },
        { id: 'image', label: t('images'), icon: Image },
        { id: 'video', label: t('videos'), icon: Video },
    ];

    return (
        <>
        <Card>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-semibold text-maryon-text-primary">{t('media_library')}</h2>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <input type="file" id="media-upload-input" multiple className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                    <Button onClick={() => setIsImageModalOpen(true)} variant="secondary">
                        <Sparkles className="w-5 h-5 me-2" />
                        {t('generate_image')}
                    </Button>
                    <Button onClick={() => setIsVideoModalOpen(true)} variant="secondary">
                        <Film className="w-5 h-5 me-2" />
                        {t('generate_video')}
                    </Button>
                    <Button onClick={triggerFileInput}>
                        <Upload className="w-5 h-5 me-2" />
                        {t('upload_media')}
                    </Button>
                </div>
            </div>

            {isGenerating.video && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center gap-4">
                    <Sparkles className="w-6 h-6 animate-spin text-blue-600"/>
                    <p>{videoStatus}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-end gap-4 mb-6 p-4 bg-maryon-hover rounded-lg border border-maryon-border">
                <div className="w-full md:flex-grow">
                    <label htmlFor="media-search" className="block mb-2 text-sm font-medium text-maryon-text-secondary">{t('search')}</label>
                    <div className="relative">
                        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-maryon-text-muted pointer-events-none" />
                        <input
                            id="media-search"
                            type="text"
                            placeholder={t('search_media_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-maryon-surface border border-maryon-border text-maryon-text-primary rounded-lg block ps-10 p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none"
                        />
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <label className="block mb-2 text-sm font-medium text-maryon-text-secondary">{t('filter_by_date')}</label>
                    <div className="flex items-center gap-2">
                        <input type="date" name="from" value={dateFilter.from} onChange={handleDateChange} className="bg-maryon-surface border border-maryon-border text-maryon-text-secondary rounded-lg p-2 text-sm focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none w-full"/>
                        <span className="text-maryon-text-muted">-</span>
                        <input type="date" name="to" value={dateFilter.to} onChange={handleDateChange} className="bg-maryon-surface border border-maryon-border text-maryon-text-secondary rounded-lg p-2 text-sm focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none w-full"/>
                    </div>
                </div>
                <div className="w-full md:w-auto min-w-[200px]">
                    <Select id="size-filter" label={t('filter_by_size')} value={sizeFilter} onChange={e => setSizeFilter(e.target.value as any)}>
                        <option value="all">{t('any_size')}</option>
                        <option value="small">{t('size_small')}</option>
                        <option value="medium">{t('size_medium')}</option>
                        <option value="large">{t('size_large')}</option>
                    </Select>
                </div>
                 <div className="w-full md:w-auto">
                    <label className="block mb-2 text-sm font-medium text-maryon-text-secondary">{t('type')}</label>
                    <div className="flex items-center bg-maryon-surface p-1 rounded-lg border border-maryon-border">
                        {filterButtons.map(btn => (
                           <Button 
                             key={btn.id}
                             variant={filter === btn.id ? 'secondary' : 'ghost'} 
                             className={`px-3 py-1.5 h-auto text-sm w-full justify-center ${filter === btn.id ? 'bg-maryon-surface shadow-sm' : 'bg-transparent border-transparent'}`}
                             onClick={() => setFilter(btn.id as any)}
                           >
                            {btn.icon && <btn.icon className="w-4 h-4 me-2"/>}
                            {btn.label}
                           </Button>
                        ))}
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredAssets.map(asset => (
                    <AssetCard key={asset.id} asset={asset} onDelete={handleDelete} onEdit={handleEditImage} />
                ))}
            </div>
        </Card>
        <Modal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            title={t('generate_image_modal_title')}
        >
            <GenerateImageForm
                onSave={handleGenerateImage}
                onCancel={() => setIsImageModalOpen(false)}
                isGenerating={isGenerating.image}
            />
        </Modal>
        <Modal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            title={t('generate_video_modal_title')}
        >
            <GenerateVideoForm
                onSave={handleGenerateVideo}
                onCancel={() => setIsVideoModalOpen(false)}
                isGenerating={isGenerating.video}
            />
        </Modal>
        <ImageEditorModal
            asset={editingAsset}
            isOpen={!!editingAsset}
            onClose={() => setEditingAsset(null)}
            onSave={handleSaveEditedImage}
        />
        </>
    );
};