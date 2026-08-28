import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listAddressesRequest, deleteAddressRequest, createAddressRequest } from '../api/addresses.api';
import { fetchAddressByCep } from '../utils/fetchAddressByCep';
import { formatCep } from '../utils/formatCep';
import { listMyOrdersRequest, cancelOrderRequest } from '../api/orders.api';
import { formatPrice } from '../utils/formatPrice';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const statusLabels = {
  pending: 'Pendente',
  paid: 'Pago',
  processing: 'Em preparo',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors = {
  pending: 'text-brass',
  paid: 'text-moss',
  processing: 'text-moss',
  shipped: 'text-moss',
  delivered: 'text-mossDark',
  cancelled: 'text-ember',
};

const tabs = [
  { id: 'orders', label: 'Meus pedidos' },
  { id: 'addresses', label: 'Endereços' },
  { id: 'profile', label: 'Perfil' },
];

const emptyAddress = {
  label: 'Casa',
  recipientName: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  isDefault: false,
};

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    listMyOrdersRequest()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleCancel = async (id) => {
    try {
      await cancelOrderRequest(id);
      loadOrders();
    } catch {
      // erro silencioso
    }
  };

  if (loading) return <Loader label="Carregando pedidos" />;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Você ainda não fez nenhum pedido"
        description="Suas próximas compras vão aparecer aqui."
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-sm border border-walnut/15 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-xs text-walnutLight">Pedido #{order.id.slice(0, 8)}</p>
              <p className="font-display text-lg text-ink">{formatPrice(order.total)}</p>
            </div>
            <span className={`font-mono text-xs font-semibold uppercase tracking-widest ${statusColors[order.status]}`}>
              {statusLabels[order.status] || order.status}
            </span>
          </div>

          <div className="joinery-rule my-4" />

          <ul className="space-y-1 text-sm text-walnutLight">
            {order.items?.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.quantity}× {item.productName}</span>
                <span className="font-mono text-ink">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          {order.status === 'pending' && (
            <button
              onClick={() => handleCancel(order.id)}
              className="mt-4 font-mono text-xs uppercase tracking-widest text-ember hover:text-emberDark"
            >
              Cancelar pedido
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyAddress);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState('');

  const loadAddresses = () => {
    setLoading(true);
    listAddressesRequest()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadAddresses, []);

  const handleChange = (e) => {
    const rawValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;

    if (name === 'zipCode') {
      const formatted = formatCep(rawValue);
      setFormData((prev) => ({ ...prev, zipCode: formatted }));

      const clean = formatted.replace(/\D/g, '');
      if (clean.length === 8) {
        setLoadingCep(true);
        fetchAddressByCep(clean)
          .then((fetched) => {
            if (fetched) {
              setFormData((prev) => ({
                ...prev,
                street: fetched.street || prev.street,
                neighborhood: fetched.neighborhood || prev.neighborhood,
                city: fetched.city || prev.city,
                state: fetched.state || prev.state,
              }));
            }
          })
          .finally(() => setLoadingCep(false));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: rawValue }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createAddressRequest(formData);
      setShowForm(false);
      setFormData(emptyAddress);
      loadAddresses();
    } catch (err) {
      setError(err.message || 'Não foi possível cadastrar o endereço.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddressRequest(id);
      loadAddresses();
    } catch {
      // erro silencioso
    }
  };

  if (loading) return <Loader label="Carregando endereços" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-walnut/15 pb-4">
        <h2 className="font-display text-xl text-ink">Endereços salvos</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="btn-primary py-2 px-4 text-xs font-mono uppercase tracking-wider"
        >
          {showForm ? 'Cancelar' : '+ Novo Endereço'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="space-y-4 rounded-sm border border-walnut/20 bg-walnut/5 p-5 max-w-xl">
          <h3 className="font-display text-lg text-ink">Cadastrar novo endereço</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Identificador (Ex: Casa, Trabalho)</label>
              <input
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="field-input"
                placeholder="Casa"
              />
            </div>
            <div>
              <label className="field-label">Nome do destinatário</label>
              <input
                name="recipientName"
                required
                value={formData.recipientName}
                onChange={handleChange}
                className="field-input"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">CEP {loadingCep && <span className="text-ember text-xs">(Buscando...)</span>}</label>
              <input
                name="zipCode"
                required
                maxLength={9}
                value={formData.zipCode}
                onChange={handleChange}
                className="field-input"
                placeholder="00000-000"
              />
            </div>
            <div className="col-span-2">
              <label className="field-label">Rua / Logradouro</label>
              <input
                name="street"
                required
                value={formData.street}
                onChange={handleChange}
                className="field-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">Número</label>
              <input
                name="number"
                required
                value={formData.number}
                onChange={handleChange}
                className="field-input"
              />
            </div>
            <div className="col-span-2">
              <label className="field-label">Complemento (opcional)</label>
              <input
                name="complement"
                value={formData.complement}
                onChange={handleChange}
                className="field-input"
                placeholder="Apto, Bloco..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">Bairro</label>
              <input
                name="neighborhood"
                required
                value={formData.neighborhood}
                onChange={handleChange}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Cidade</label>
              <input
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">UF</label>
              <input
                name="state"
                required
                maxLength={2}
                value={formData.state}
                onChange={handleChange}
                className="field-input uppercase"
                placeholder="SP"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-sm border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-emberDark">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Salvando...' : 'Salvar Endereço'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <EmptyState
          title="Nenhum endereço cadastrado"
          description="Endereços salvos aparecem automaticamente no checkout."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-sm border border-walnut/15 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-walnut uppercase tracking-wide">
                    {addr.label || 'Endereço'}
                  </span>
                  <p className="font-semibold text-ink mt-0.5">{addr.recipientName}</p>
                  {addr.isDefault && (
                    <span className="mt-1 inline-block rounded-full bg-moss/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-mossDark">
                      Padrão
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="font-mono text-[11px] uppercase tracking-widest text-walnutLight hover:text-ember"
                >
                  Remover
                </button>
              </div>
              <p className="mt-3 text-sm text-walnutLight">
                {addr.street}, {addr.number}
                {addr.complement ? ` — ${addr.complement}` : ''}
              </p>
              <p className="text-sm text-walnutLight">
                {addr.neighborhood}, {addr.city} - {addr.state}
              </p>
              <p className="text-sm text-walnutLight">CEP {addr.zipCode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md">
      <div className="space-y-4">
        <div>
          <p className="field-label">Nome</p>
          <p className="text-ink">{user?.name}</p>
        </div>
        <div>
          <p className="field-label">E-mail</p>
          <p className="text-ink">{user?.email}</p>
        </div>
        {user?.phone && (
          <div>
            <p className="field-label">Telefone</p>
            <p className="text-ink">{user.phone}</p>
          </div>
        )}
        <div>
          <p className="field-label">Tipo de conta</p>
          <p className="text-ink capitalize">{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
        </div>
      </div>

      <button onClick={logout} className="btn-secondary mt-8">
        Sair da conta
      </button>
    </div>
  );
}

export default function Account() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow text-moss">Minha conta</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Olá, {user?.name?.split(' ')[0]}</h1>

      <div className="mt-8 flex gap-2 border-b border-walnut/15">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-body text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-ember text-ember'
                : 'text-walnutLight hover:text-walnut'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'addresses' && <AddressesTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}
