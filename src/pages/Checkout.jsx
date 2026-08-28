import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { listAddressesRequest, createAddressRequest } from '../api/addresses.api';
import { fetchAddressByCep } from '../utils/fetchAddressByCep';
import { formatCep } from '../utils/formatCep';
import { createOrderRequest } from '../api/orders.api';
import { formatPrice } from '../utils/formatPrice';
import Loader from '../components/Loader';

const emptyAddress = {
  recipientName: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [loadingCep, setLoadingCep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);

  useEffect(() => {
    listAddressesRequest()
      .then((list) => {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setSelectedAddressId(def.id);
        if (list.length === 0) setShowNewAddressForm(true);
      })
      .catch(() => setShowNewAddressForm(true))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const shippingEstimate = 25;
  const total = subtotal + shippingEstimate;

  const handleNewAddressChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.value;

    if (name === 'zipCode') {
      const formatted = formatCep(rawValue);
      setNewAddress((a) => ({ ...a, zipCode: formatted }));

      const clean = formatted.replace(/\D/g, '');
      if (clean.length === 8) {
        setLoadingCep(true);
        fetchAddressByCep(clean)
          .then((fetched) => {
            if (fetched) {
              setNewAddress((prev) => ({
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
      setNewAddress((a) => ({ ...a, [name]: rawValue }));
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const created = await createAddressRequest(newAddress);
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      setNewAddress(emptyAddress);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar o endereço.');
    }
  };

  const handlePlaceOrder = async () => {
    setError('');

    if (!selectedAddressId) {
      setError('Selecione ou cadastre um endereço de entrega.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrderRequest({
        addressId: selectedAddressId,
        paymentMethod,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      setOrderCreated(order);
      clearCart();
    } catch (err) {
      setError(err.message || 'Não foi possível concluir o pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-moss text-paper">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="eyebrow text-moss">Pedido confirmado</p>
        <h1 className="mt-2 font-display text-3xl text-ink">Obrigado pela compra!</h1>
        <p className="mt-3 text-sm text-walnutLight">
          Seu pedido <span className="font-mono text-ink">#{orderCreated.id?.slice(0, 8)}</span> foi
          registrado e já está sendo preparado na oficina.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/conta" className="btn-primary">Ver meus pedidos</Link>
          <Link to="/loja" className="btn-secondary">Continuar comprando</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Seu carrinho está vazio</h1>
        <Link to="/loja" className="btn-primary mt-6">Ir para a loja</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow text-moss">Checkout</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Finalizar compra</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {/* Endereço */}
          <section>
            <h2 className="font-display text-xl text-ink">Endereço de entrega</h2>

            {loadingAddresses ? (
              <Loader label="Carregando endereços" />
            ) : (
              <div className="mt-4 space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors ${
                      selectedAddressId === addr.id
                        ? 'border-ember bg-ember/5'
                        : 'border-walnut/20 hover:border-walnut/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-ember"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-ink">{addr.recipientName}</p>
                      <p className="text-walnutLight">
                        {addr.street}, {addr.number}
                        {addr.complement ? ` — ${addr.complement}` : ''}
                      </p>
                      <p className="text-walnutLight">
                        {addr.neighborhood}, {addr.city} - {addr.state}
                      </p>
                      <p className="text-walnutLight">CEP {addr.zipCode}</p>
                    </div>
                  </label>
                ))}

                {!showNewAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="font-mono text-xs uppercase tracking-widest text-ember hover:text-emberDark"
                  >
                    + Cadastrar novo endereço
                  </button>
                )}

                {showNewAddressForm && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="mt-2 space-y-4 rounded-sm border border-walnut/20 p-4"
                  >
                    <div>
                      <label className="field-label">Nome do destinatário</label>
                      <input
                        name="recipientName"
                        required
                        value={newAddress.recipientName}
                        onChange={handleNewAddressChange}
                        className="field-input"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="field-label">
                          CEP {loadingCep && <span className="text-ember text-xs">(Buscando...)</span>}
                        </label>
                        <input
                          name="zipCode"
                          required
                          maxLength={9}
                          value={newAddress.zipCode}
                          onChange={handleNewAddressChange}
                          className="field-input"
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="field-label">Rua</label>
                        <input
                          name="street"
                          required
                          value={newAddress.street}
                          onChange={handleNewAddressChange}
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
                          value={newAddress.number}
                          onChange={handleNewAddressChange}
                          className="field-input"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="field-label">Complemento</label>
                        <input
                          name="complement"
                          value={newAddress.complement}
                          onChange={handleNewAddressChange}
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
                          value={newAddress.neighborhood}
                          onChange={handleNewAddressChange}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label">Cidade</label>
                        <input
                          name="city"
                          required
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="field-label">UF</label>
                        <input
                          name="state"
                          required
                          maxLength={2}
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          className="field-input uppercase"
                          placeholder="SP"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary">Salvar endereço</button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="btn-ghost"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}
          </section>

          {/* Pagamento */}
          <section className="mt-10">
            <h2 className="font-display text-xl text-ink">Forma de pagamento</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { id: 'pix', label: 'Pix' },
                { id: 'credit_card', label: 'Cartão de crédito' },
                { id: 'boleto', label: 'Boleto' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`rounded-sm border px-5 py-2.5 font-body text-sm transition-colors ${
                    paymentMethod === method.id
                      ? 'border-ember bg-ember text-paper'
                      : 'border-walnut/25 text-walnut hover:border-ember hover:text-ember'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Resumo */}
        <div className="h-fit rounded-sm border border-walnut/15 bg-[#F7F2E6] p-6">
          <h2 className="font-display text-xl text-ink">Resumo do pedido</h2>
          <div className="mt-4 space-y-2 text-sm text-walnutLight">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>{item.quantity}× {item.name}</span>
                <span className="font-mono text-ink">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="joinery-rule my-5" />
          <div className="space-y-2 text-sm text-walnutLight">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span className="font-mono text-ink">{formatPrice(shippingEstimate)}</span>
            </div>
          </div>
          <div className="joinery-rule my-5" />
          <div className="flex justify-between font-display text-lg text-ink">
            <span>Total</span>
            <span className="font-mono">{formatPrice(total)}</span>
          </div>

          {error && (
            <p className="mt-4 rounded-sm border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-emberDark">
              {error}
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn-primary mt-6 w-full disabled:opacity-60"
          >
            {submitting ? 'Confirmando pedido...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
