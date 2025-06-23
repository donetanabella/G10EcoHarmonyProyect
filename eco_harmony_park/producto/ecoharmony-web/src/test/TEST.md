# Información sobre Tests - EcoHarmony Park

## **Nota para la Profesora**

Los tests de este proyecto fueron implementados utilizando **Jest** (framework de testing para JavaScript), por lo que la sintaxis difiere de la mostrada en clase.

---

## **Comparación de Sintaxis**

### **Sintaxis Enseñada en Clase:**

```java
func (test_function()) {
    value1 = foo;
    value2 = bar;
    assert.equals(function(), result);
}
```

### **Sintaxis Utilizada (Jest + JavaScript):**

```javascript
test('Descripción del test', () => {
    // Arreglo
    const value1 = foo;
    const value2 = bar;

    // Accion
    const resultado = function();

    // Assert
    expect(resultado).toBe(expected);
});
```

---

## 🎯 **Equivalencias**

| Concepto Clase         | Jest JavaScript                 |
| ---------------------- | ------------------------------- |
| `assert.equals()`      | `expect().toBe()`               |
| `func test_function()` | `test('descripción', () => {})` |
| Función de test        | Arrow function `() => {}`       |

> **Nota:** Aunque la sintaxis es diferente, los **conceptos fundamentales de testing** son los mismos.
