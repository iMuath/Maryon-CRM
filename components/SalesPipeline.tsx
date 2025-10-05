import React, { useState, useMemo } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { mockDeals, mockCustomers } from '../data/mockData';
import type { Deal, DealStatus } from '../types';
import { Modal } from './ui/Modal';
import { DealForm } from './DealForm';
import { Button } from './ui/Button';
import { PlusCircle, Search, User, Pencil, Trash2 } from 'lucide-react';

const DealCard: React.FC<{ 
    deal: Deal; 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ deal, onDragStart, onEdit, onDelete }) => {
  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={onEdit}
      className="bg-maryon-surface border border-maryon-border p-4 rounded-lg mb-4 cursor-grab active:cursor-grabbing hover:shadow-lg hover:-translate-y-1 hover:border-maryon-accent transition-all group relative"
    >
      <div className="absolute top-2 end-2 flex items-center space-x-1 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }} 
          className="p-1.5 rounded-md hover:bg-maryon-hover text-maryon-text-secondary hover:text-maryon-text-primary"
          aria-label="Edit Deal"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }} 
          className="p-1.5 rounded-md hover:bg-maryon-hover text-maryon-text-secondary hover:text-red-500"
          aria-label="Delete Deal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-bold text-maryon-text-primary pr-12">{deal.title}</h4>
      <p className="text-sm text-maryon-text-secondary">{deal.customerName}</p>
      <p className="text-lg font-semibold text-maryon-text-primary mt-2">
        ${deal.value.toLocaleString()}
      </p>
      <div className="flex items-center mt-3 pt-3 border-t border-maryon-border">
          <User className="w-4 h-4 text-maryon-text-muted mr-2" />
          <span className="text-xs text-maryon-text-secondary">{deal.assignedTo}</span>
      </div>
    </div>
  );
};

const PipelineColumn: React.FC<{ 
    title: string; 
    deals: Deal[]; 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: DealStatus) => void;
    onEdit: (deal: Deal) => void;
    onDelete: (deal: Deal) => void;
    status: DealStatus;
}> = ({ title, deals, onDragStart, onDrop, onEdit, onDelete, status }) => {
    const [isOver, setIsOver] = useState(false);
    const { t } = useLocalization();

    const totalValue = useMemo(() => {
        return deals.reduce((sum, deal) => sum + deal.value, 0);
    }, [deals]);

    return (
        <div 
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => { onDrop(e, status); setIsOver(false); }}
            className={`flex flex-col flex-shrink-0 w-80 rounded-lg transition-colors ${isOver ? 'bg-maryon-hover' : ''}`}
        >
            <div className="p-4 sticky top-0 bg-maryon-background z-10">
                <h3 className="text-lg font-semibold text-maryon-text-primary mb-1">{title} ({deals.length})</h3>
                <p className="text-sm font-medium text-maryon-text-secondary">{t('total_value')}: ${totalValue.toLocaleString()}</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
                {deals.map(deal => (
                    <DealCard 
                      key={deal.id} 
                      deal={deal} 
                      onDragStart={onDragStart} 
                      onEdit={() => onEdit(deal)}
                      onDelete={() => onDelete(deal)}
                    />
                ))}
            </div>
        </div>
    );
}

export const SalesPipeline: React.FC = () => {
  const { t } = useLocalization();
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  const handleOpenModal = (deal: Deal | null = null) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  const handleSaveDeal = (dealData: Omit<Deal, 'id'> | Deal) => {
    if ('id' in dealData) {
      setDeals(deals.map(d => d.id === dealData.id ? dealData : d));
    } else {
      const newDeal: Deal = {
        ...(dealData as Omit<Deal, 'id'>),
        id: `D${(deals.length + 1).toString().padStart(3, '0')}`,
      };
      setDeals(prevDeals => [newDeal, ...prevDeals]);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (deal: Deal) => {
    setDealToDelete(deal);
  };

  const handleConfirmDelete = () => {
    if (dealToDelete) {
      setDeals(currentDeals => currentDeals.filter(d => d.id !== dealToDelete.id));
      setDealToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDealToDelete(null);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
    e.dataTransfer.setData("dealId", dealId);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: DealStatus) => {
    const dealId = e.dataTransfer.getData("dealId");
    setDeals(currentDeals =>
      currentDeals.map(deal =>
        deal.id === dealId ? { ...deal, status: newStatus } : deal
      )
    );
  };

  const columns: { status: DealStatus; titleKey: string }[] = [
    { status: 'New Lead', titleKey: 'new_lead' },
    { status: 'Contacted', titleKey: 'contacted' },
    { status: 'Proposal', titleKey: 'proposal' },
    { status: 'Negotiation', titleKey: 'negotiation' },
    { status: 'Won', titleKey: 'won' },
    { status: 'Lost', titleKey: 'lost' },
  ];

  const filteredDeals = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return deals;
    return deals.filter(deal => 
        deal.title.toLowerCase().includes(lowercasedQuery) ||
        deal.customerName.toLowerCase().includes(lowercasedQuery)
    );
  }, [deals, searchQuery]);

  const dealsByStatus = useMemo(() => {
    return columns.reduce((acc, col) => {
        acc[col.status] = filteredDeals.filter(d => d.status === col.status);
        return acc;
    }, {} as Record<DealStatus, Deal[]>);
  }, [filteredDeals]);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4 border-b border-maryon-border bg-maryon-surface flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
                 <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <Search className="w-5 h-5 text-maryon-text-muted" />
                </div>
                <input
                    type="text"
                    placeholder={t('search_deals_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-maryon-background border border-maryon-border text-maryon-text-primary rounded-lg block ps-10 p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none"
                />
            </div>
            <Button onClick={() => handleOpenModal()}>
                <PlusCircle className="w-5 h-5 me-2" />
                {t('add_deal')}
            </Button>
        </div>
        <div className="flex-1 flex overflow-x-auto h-full p-4 space-x-6 rtl:space-x-reverse bg-maryon-background">
          {columns.map(({ status, titleKey }) => (
            <PipelineColumn
              key={status}
              title={t(titleKey)}
              deals={dealsByStatus[status]}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onEdit={handleOpenModal}
              onDelete={handleDeleteClick}
              status={status}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedDeal ? t('edit_deal') : t('add_deal')}
      >
          <DealForm
            onSave={handleSaveDeal}
            onCancel={handleCloseModal}
            deal={selectedDeal}
            customers={mockCustomers}
          />
      </Modal>

      <Modal
        isOpen={!!dealToDelete}
        onClose={handleCancelDelete}
        title={t('delete_deal_title')}
      >
        <div className="text-center">
          <p className="text-maryon-text-secondary mb-6">{t('delete_deal_confirm')}</p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Button onClick={handleCancelDelete} variant="secondary">
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {t('delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};