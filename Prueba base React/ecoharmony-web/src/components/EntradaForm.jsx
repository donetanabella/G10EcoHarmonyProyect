import { useState, useEffect, useRef } from "react";
import { comprarEntradas } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/estiloParque.css";
import "../styles/EntradaForm.css";
import visaLogo from '../assets/visa-logo.png';
import mastercardLogo from '../assets/mastercard-logo.png';

export default function EntradaForm() {
  const [form, setForm] = useState({
    fecha: "",
    cantidad: 1,
    visitantes: [{ nombre: "", apellido: "", edad: "", tipoEntrada: "regular" }],
    formaPago: "",
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "",
    cvv: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [, setConfirmacion] = useState(null);
  const [montoTotal, setMontoTotal] = useState(0);
  const [fechaMinima, setFechaMinima] = useState(new Date());
  const [fechaMaxima, setFechaMaxima] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [fechaVencimientoPicker, setFechaVencimientoPicker] = useState(null);
  const tarjetaRef = useRef(null);
  const [, setErrorTarjeta] = useState("");
  const [compraExitosa, setCompraExitosa] = useState(false);

  // Configurar fechas mínimas y máximas permitidas
  useEffect(() => {
    const hoy = new Date();
    const horaLimite = 18

    if (hoy.getHours() >= horaLimite) {
      hoy.setDate(hoy.getDate() + 1);
    }
    
    const seisMesesDespues = new Date();
    seisMesesDespues.setMonth(hoy.getMonth() + 6);
    
    setFechaMinima(hoy);
    setFechaMaxima(seisMesesDespues);
  }, []);

  // Calcular monto total cuando cambian los visitantes o sus datos
  useEffect(() => {
    calculateTotal();
  }, [form.visitantes]);

  // Función para deshabilitar días específicos (martes y jueves)
  const esDiaDeshabilitado = (fecha) => {
    const diaSemana = fecha.getDay();
    // 2 es martes y 4 es jueves
    return diaSemana === 2 || diaSemana === 4;
  };

  const handleFechaChange = (fecha) => {
    if (fecha) {
      setFechaSeleccionada(fecha);
      
      // Asegurarnos de usar un formato ISO estándar YYYY-MM-DD para comunicación con el servidor
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;
      
      console.log("Fecha seleccionada formateada:", fechaFormateada);
      setForm({ ...form, fecha: fechaFormateada });
    } else {
      setFechaSeleccionada(null);
      setForm({ ...form, fecha: "" });
    }
    
    // Limpiar mensajes al cambiar valores
    if (mensaje) setMensaje("");
  };

  // Nueva función para manejar el cambio del DatePicker de mes/año
  const handleFechaVencimientoChange = (date) => {
    setFechaVencimientoPicker(date);
    if (date) {
      // Formato MM/AA
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const anio = String(date.getFullYear()).slice(-2);
      setForm({ ...form, fechaVencimiento: `${mes}/${anio}` });
    } else {
      setForm({ ...form, fechaVencimiento: "" });
    }
  };

  // Actualizar la función calculateTotal para devolver el valor numérico, no la cadena formateada
  const calculateTotal = () => {
    let total = 0;
    form.visitantes.forEach(visitante => {
      const precioBase = visitante.tipoEntrada === "vip" ? 10000 : 6000;
      
      // Aplicar descuentos por edad
        if (visitante.edad === "Niño" || visitante.edad === "Adulto Mayor") {
          // 50% de descuento para niños y adultos mayores
          total += precioBase * 0.5;
        } else {
          total += precioBase;
        }
    });
    
    // Formato para mostrar al usuario
    const montoFormateado = formatCurrency(total);
    setMontoTotal(montoFormateado);
    
    // Devolver el valor numérico sin formato para el API
    return total;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (["nombre", "apellido", "nombreTitular"].includes(name)) {
      // Permitir solo letras y espacios
      const valorValidado = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      if (index !== null) {
        const nuevosVisitantes = [...form.visitantes];
        nuevosVisitantes[index] = {
          ...nuevosVisitantes[index],
          [name]: valorValidado,
        };
        setForm({ ...form, visitantes: nuevosVisitantes });
      } else {
        setForm({ ...form, [name]: valorValidado });
      }
    } else if (index !== null) {
      const nuevosVisitantes = [...form.visitantes];
      nuevosVisitantes[index] = {
        ...nuevosVisitantes[index],
        [name]: value,
      };
      setForm({ ...form, visitantes: nuevosVisitantes });
    } else if (name === "numeroTarjeta") {
      // Formatear número de tarjeta como XXXX XXXX XXXX XXXX
      const valorFormateado = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substring(0, 19);
      setForm({ ...form, [name]: valorFormateado });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    // Limpiar mensajes al cambiar valores
    if (mensaje) setMensaje("");
  };

  const handleTipoEntradaChange = (e, index) => {
    const { checked } = e.target;
    const nuevosVisitantes = [...form.visitantes];
    nuevosVisitantes[index] = {
      ...nuevosVisitantes[index],
      tipoEntrada: checked ? "vip" : "regular"
    };
    setForm({ ...form, visitantes: nuevosVisitantes });
  };

  const handleCantidadChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    if (nuevaCantidad <= 10) {
      const visitantesActuales = [...form.visitantes];
      
      // Si aumentamos la cantidad, agregar nuevos visitantes
      if (nuevaCantidad > visitantesActuales.length) {
        for (let i = visitantesActuales.length; i < nuevaCantidad; i++) {
          visitantesActuales.push({ nombre: "", apellido: "", edad: "", tipoEntrada: "regular" });
        }
      } 
      // Si reducimos la cantidad, eliminar visitantes sobrantes
      else if (nuevaCantidad < visitantesActuales.length) {
        visitantesActuales.splice(nuevaCantidad);
      }
      
      setForm({
        ...form,
        cantidad: nuevaCantidad,
        visitantes: visitantesActuales,
      });
    }
  };

  const validarTarjeta = () => {
    const { numeroTarjeta, formaPago } = form;

    if (formaPago === "efectivo") return true;

    // Eliminar espacios
    const numero = numeroTarjeta.replace(/\s/g, '');

    // Debe tener 16 dígitos
    if (!/^\d{16}$/.test(numero)) {
      setMensaje("Tarjeta inválida");
      return false;
    }

    if (formaPago === "visa" && !numero.startsWith("4")) {
      setMensaje("Tarjeta inválida. Las tarjetas Visa comienzan con 4");
      return false;
    }

    if (formaPago === "mastercard" && !(numero.startsWith("5") || numero.startsWith("2"))) {
      setMensaje("Tarjeta inválida. Las tarjetas Mastercard comienzan con 5 o 2");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setErrorTarjeta("");

    // Validar tarjeta si corresponde
    if (form.formaPago !== "efectivo") {
      if (!form.numeroTarjeta || !form.nombreTitular || !form.fechaVencimiento || !form.cvv) {
        setMensaje("Por favor complete todos los datos de la tarjeta");
        tarjetaRef.current.focus();
        return;
      }
      if (!validarTarjeta()) {
        tarjetaRef.current.focus();
        return;
      }
    }
    
    try {
      // Asegurar que montoTotal es un número
      const montoNumerico = calculateTotal();
      
      const datosCompra = {
        ...form,
        montoTotal: montoNumerico,
        numeroTarjeta: form.formaPago === "efectivo" ? null : form.numeroTarjeta,
      };
      
      console.log("Enviando datos al servidor:", datosCompra);
      const res = await comprarEntradas(datosCompra);
      console.log("Respuesta del servidor:", res.data);  

      if (form.formaPago === "efectivo") {
        setMensaje("Usted reservó su entrada con éxito. Para confirmar la compra, debe abonar en la boletería del parque");
      } else {
        setMensaje(res.data.mensaje);
      }
      
      // Guardar datos de confirmación para mostrar
      function formatearFechaLocal(fechaStr) {
        // fechaStr: "YYYY-MM-DD"
        const [year, month, day] = fechaStr.split('-');
        return `${day}/${month}/${year}`;
      }
      
      const fechaFormateada = formatearFechaLocal(form.fecha);
      setConfirmacion({
        id: res.data.detalles.id,
        estado: res.data.detalles.estado,
        fecha: fechaFormateada,
        cantidad: form.cantidad,
        visitantes: form.visitantes,
        montoTotal: montoTotal,
        formaPago: form.formaPago === "efectivo" ? "Efectivo" : 
                  form.formaPago === "visa" ? "Tarjeta Visa" : "Tarjeta Mastercard"
      });
      
      localStorage.setItem("detalleCompra", JSON.stringify({
        id: res.data.detalles.id,
        estado: res.data.detalles.estado,
        fecha: fechaFormateada,
        cantidad: form.cantidad,
        visitantes: form.visitantes,
        montoTotal: montoTotal,
        formaPago: form.formaPago === "efectivo" ? "Efectivo" : 
                  form.formaPago === "visa" ? "Tarjeta Visa" : "Tarjeta Mastercard"
      }));

      setCompraExitosa(true);

      window.open("/detalle-compra", "_blank");
      
    } catch (err) {
      // Mostrar error detallado
      console.error("Error completo:", err);
      console.error("Detalles de respuesta:", err.response?.data);
      if (err.response?.data?.error=== "Saldo insuficiente") {
        setMensaje("Saldo insuficiente. Por favor verifique su saldo y vuelva a intentar.");
        tarjetaRef.current.focus();
      } else  {
        setMensaje(err.response?.data?.error || "Error al procesar la compra. Por favor intente nuevamente.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>🎟️ Comprar Entradas</h2>

      <label>📅 Fecha de visita:</label>
      <div className="datepicker-container">
        <DatePicker
          selected={fechaSeleccionada}
          onChange={handleFechaChange}
          minDate={fechaMinima}
          maxDate={fechaMaxima}
          filterDate={(date) => !esDiaDeshabilitado(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Seleccione una fecha"
          className="datepicker-input"
          required
        />
        <p className="fechas-info">Nota: El parque permanece cerrado los martes y jueves</p>
      </div>
      
      <label className="cantidad-entradas">👨‍👩‍👧‍👦 Cantidad de entradas (máx 10):</label>
      <input
        type="number"
        name="cantidad"
        value={form.cantidad}
        onChange={handleCantidadChange}
        min={1}
        max={10}
        required
      />

      {form.visitantes.map((visitante, index) => (
        <div key={index} className="visitante-form">
          <h3>Visitante #{index + 1}</h3>
          
          <div className="input-row">
            <div className="input-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={visitante.nombre}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={visitante.apellido}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label>Categoría:</label>
              <select
                name="edad"
                value={visitante.edad}
                onChange={(e) => handleChange(e, index)}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Niño">Niño (menor de 10 años)</option>
                <option value="Adulto">Adulto (10-64 años)</option>
                <option value="Adulto Mayor">Adulto Mayor (65+ años)</option>
              </select>
            </div>
            
            <div className="input-group checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={visitante.tipoEntrada === "vip"}
                  onChange={(e) => handleTipoEntradaChange(e, index)}
                />
                Entrada VIP
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="payment-section">
        <h3>Información de Pago</h3>
        
        <label>💳 Método de pago:</label>
        <select name="formaPago" value={form.formaPago} onChange={handleChange} required>
          <option value="">Seleccionar</option>
          <option value="efectivo">Efectivo (boletería)</option>
          <option value="visa">Tarjeta Visa</option>
          <option value="mastercard">Tarjeta Mastercard</option>
        </select>
        
        {form.formaPago && form.formaPago !== "efectivo" && (
          <div className="card-info">
            <div className="card-logos">
              {form.formaPago === "visa" && <img src={visaLogo} alt="Visa" className="card-logo" />}
              {form.formaPago === "mastercard" && <img src={mastercardLogo} alt="Mastercard" className="card-logo" />}
            </div>
            
            <label>Número de tarjeta:</label>
            <input
              type="text"
              name="numeroTarjeta"
              value={form.numeroTarjeta}
              onChange={(e) => {
                const valor = e.target.value;
                // Permitir solo números y formatear como XXXX XXXX XXXX XXXX
                const valorFormateado = valor
                  .replace(/\D/g, '') // Eliminar caracteres no numéricos
                  .replace(/(\d{4})/g, '$1 ') // Insertar un espacio cada 4 dígitos
                  .trim()
                  .substring(0, 19); // Limitar a 19 caracteres (16 dígitos + 3 espacios)
                setForm({ ...form, numeroTarjeta: valorFormateado });
              }}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
              required
            />
            
            <label>Nombre del titular:</label>
            <input
              type="text"
              name="nombreTitular"
              value={form.nombreTitular}
              onChange={handleChange}
              required
            />
            
            <div className="input-row">
              <div className="input-group">
                <label>Fecha de vencimiento:</label>
                <DatePicker
                  selected={fechaVencimientoPicker}
                  onChange={handleFechaVencimientoChange}
                  dateFormat="MM/yy"
                  showMonthYearPicker
                  minDate={new Date()}
                  placeholderText="MM/AA"
                  className="datepicker-input"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>CVV:</label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d*$/.test(valor)) { // Permitir solo números
                      setForm({ ...form, cvv: valor });
                    }
                  }}
                  placeholder="XXX"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>
        )}
        
      </div>

      <div className="total-section">
        <h3>Total a pagar: {montoTotal}</h3>
        <p className="pricing-info">Entrada Regular: $6.000 | Entrada VIP: $10.000</p>
        <p className="discount-info">Niños menores de 10 años y adultos mayores de 65 años tienen 50% de descuento</p>
      </div>

      <div className="button-container">
       {!compraExitosa ? (
          <button type="submit" style={{ color: "white" }}> Confirmar compra</button>
        ) : (
      <button style={{ color: "white" }}
        type="button"
        onClick={() => {
          // Reiniciar el formulario y los estados
          setForm({
            fecha: "",
            cantidad: 1,
            visitantes: [{ nombre: "", apellido: "", edad: "", tipoEntrada: "regular" }],
            formaPago: "",
            numeroTarjeta: "",
            nombreTitular: "",
            fechaVencimiento: "",
            cvv: "",
          });
          setMensaje("");
          setMontoTotal(0);
          setFechaSeleccionada(null);
          setFechaVencimientoPicker(null);
          setCompraExitosa(false);
        }}
      >
        Realizar otra compra
      </button>
  )}
</div>

        

      {mensaje && (
        <p className={`message${mensaje.toLowerCase().includes("tarjeta") || mensaje.toLowerCase().includes("saldo") ? " error" : ""}`}>
          {mensaje}
        </p>
      )}

    </form>
  );
}
