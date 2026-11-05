import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "tu-secreto-super-secreto";

const authMiddleware = (req, res, next) => {
  // 1. Obtener el encabezado de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token." });
  }

  // 2. Extraer el token de la forma "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Formato de token inválido." });
  }

  try {
    // 3. Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Adjuntar la información del usuario al objeto de la solicitud (req)
    // Esto hace que los datos del usuario estén disponibles en las rutas protegidas
    req.user = decoded.user;

    // 5. Pasar el control al siguiente middleware o controlador de la ruta
    next();
  } catch (error) {
    // Manejar errores de verificación del token (ej. token expirado o inválido)
    console.error("Error de autenticación:", error);
    return res.status(401).json({ message: "Token no válido o expirado." });
  }
};

export default authMiddleware;