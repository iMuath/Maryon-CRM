import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlusCircle, Phone, Search } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import { mockCustomers } from '../data/mockData';
import { Modal } from './ui/Modal';
import { CustomerForm } from './CustomerForm';
import { Dialer } from './Dialer';
import type { Customer } from '../types';

export const Customers: React.FC = () => {
  const { t } = useLocalization();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [numberToCall, setNumberToCall] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const statusColors = {
    'Lead': 'bg-blue-100 text-blue-800',
    'Contact': 'bg-green-100 text-green-800',
    'Archived': 'bg-gray-100 text-gray-800',
  };

  const handleOpenFormModal = (customer: Customer | null = null) => {
    setSelectedCustomer(customer);
    setIsFormModalOpen(true);
  };
  
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleCallClick = (phoneNumber: string) => {
    setNumberToCall(phoneNumber);
    setIsDialerOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'> | Customer) => {
    if ('id' in customerData) {
      // Update existing customer
      setCustomers(customers.map(c => c.id === customerData.id ? customerData : c));
    } else {
      // Create new customer
      const newCustomer: Customer = {
        ...customerData,
        id: `C${(customers.length + 1).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers(prevCustomers => [newCustomer, ...prevCustomers]);
    }
    handleCloseFormModal();
  };

  const filteredCustomers = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      return customers;
    }
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedQuery) ||
      customer.company.toLowerCase().includes(lowercasedQuery) ||
      customer.email.toLowerCase().includes(lowercasedQuery)
    );
  }, [customers, searchQuery]);

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold text-maryon-text-primary">{t('all_customers')}</h2>
          <Button onClick={() => handleOpenFormModal()}>
            <PlusCircle className="w-5 h-5 me-2" />
            {t('add_customer')}
          </Button>
        </div>

        <div className="mb-6">
            <div className="relative w-full max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <Search className="w-5 h-5 text-maryon-text-muted" />
                </div>
                <input
                    type="text"
                    placeholder={t('search_customers')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-maryon-background border border-maryon-border text-maryon-text-primary rounded-lg block ps-10 p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start text-maryon-text-secondary">
            <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
              <tr>
                <th scope="col" className="px-6 py-3">{t('name')}</th>
                <th scope="col" className="px-6 py-3">{t('company')}</th>
                <th scope="col" className="px-6 py-3">{t('email')} & {t('phone')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('created_at')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-maryon-border hover:bg-maryon-hover">
                  <td scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap cursor-pointer" onClick={() => handleOpenFormModal(customer)}>
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenFormModal(customer)}>{customer.company}</td>
                  <td className="px-6 py-4">
                    <div>{customer.email}</div>
                    <div className="flex items-center gap-2 text-maryon-text-muted">
                      <span>{customer.phone}</span>
                      <Phone 
                        className="w-4 h-4 text-maryon-accent cursor-pointer hover:text-maryon-text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallClick(customer.phone)
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenFormModal(customer)}>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => handleOpenFormModal(customer)}>{customer.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseFormModal}
        title={selectedCustomer ? t('edit_customer') : t('add_customer')}
      >
        <CustomerForm 
          onSave={handleSaveCustomer}
          onCancel={handleCloseFormModal}
          customer={selectedCustomer}
        />
      </Modal>
      
      <Dialer
        isOpen={isDialerOpen}
        onClose={() => setIsDialerOpen(false)}
        initialNumber={numberToCall || ''}
      />
    </>
  );
};