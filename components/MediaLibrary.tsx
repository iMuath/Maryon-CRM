import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Upload, Image, Video, Trash2, Copy, Film, Sparkles, Search } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import { mockMediaAssets } from '../data/mockData';
import type { MediaAsset } from '../types';
import { Modal } from './ui/Modal';
import { GenerateVideoForm } from './GenerateVideoForm';
import { GenerateImageForm } from './GenerateImageForm';
import { Select } from './ui/Select';

const AssetCard: React.FC<{ asset: MediaAsset; onDelete: (id: string) => void }> = ({ asset, onDelete }) => {
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
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <Button variant="ghost" className="text-white hover:bg-white/20" onClick={handleCopyUrl}>
                    {copied ? t('copied') : <Copy className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-red-400" onClick={() => onDelete(asset.id)}>
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};


export const MediaLibrary: React.FC = () => {
    const { t } = useLocalization();
    const [assets, setAssets] = useState<MediaAsset[]>(mockMediaAssets);
    const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            // Type filter
            if (filter !== 'all' && asset.type !== filter) {
                return false;
            }
            // Search filter
            if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Date filter
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
            // Size filter
            if (sizeFilter !== 'all') {
                const sizeInBytes = asset.size;
                const MB = 1048576; // 1024 * 1024
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

        const newAssets: MediaAsset[] = Array.from(files).map((file, index) => ({
            id: `MA${(assets.length + index + 1).toString().padStart(3, '0')}`,
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: URL.createObjectURL(file), // Note: This is a temporary local URL
            createdAt: new Date().toISOString().split('T')[0],
            size: file.size,
        }));

        setAssets(prevAssets => [...newAssets, ...prevAssets]);
    };

    const triggerFileInput = () => {
        document.getElementById('media-upload-input')?.click();
    };
    
    const handleGenerateImage = (data: { width: number; height: number; prompt: string }) => {
        const seed = data.prompt.replace(/\s/g, '-') || 'random';
        const newImageAsset: MediaAsset = {
            id: `MA${(assets.length + 1).toString().padStart(3, '0')}`,
            name: `${seed}-${data.width}x${data.height}.jpg`,
            type: 'image',
            url: `https://picsum.photos/seed/${seed}/${data.width}/${data.height}`,
            createdAt: new Date().toISOString().split('T')[0],
            size: Math.floor(Math.random() * (5 * 1048576)) + 102400, // Random size between 100KB and 5MB
        };
        setAssets(prevAssets => [newImageAsset, ...prevAssets]);
        setIsImageModalOpen(false);
    };

    const handleGenerateVideo = (data: { prompt: string; duration: number; aspectRatio: string }) => {
        console.log('Generating video with data:', data);
        const newVideoAsset: MediaAsset = {
            id: `MA${(assets.length + 1).toString().padStart(3, '0')}`,
            name: `${data.prompt.split(' ').join('-')}.mp4`,
            type: 'video',
            url: `https://picsum.photos/seed/${data.prompt.replace(/\s/g, '-')}/400/300`,
            createdAt: new Date().toISOString().split('T')[0],
            size: Math.floor(Math.random() * (50 * 1048576)) + (5 * 1048576), // Random size between 5MB and 50MB
        };
        setAssets(prevAssets => [newVideoAsset, ...prevAssets]);
        setIsVideoModalOpen(false);
    };


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
                    <AssetCard key={asset.id} asset={asset} onDelete={handleDelete} />
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
            />
        </Modal>
        </>
    );
};