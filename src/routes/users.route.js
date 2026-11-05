import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Importación de los modelos
import User from "../models/user.js";
import Role from "../models/role.js";
import Clinic from "../models/clinic.js";
import authMiddleware from "../middleware/auth.middleware.js";

// Usamos el mismo router de express
const api = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "tu-secreto-super-secreto";

/**
 * @route   POST /auth/register
 * @desc    Registra un nuevo usuario en el sistema.
 * @access  Public
 */
api.post("/register", authMiddleware, async (req, res) => {
  const { email, password, firstName, lastName, roleName, clinicId } = req.body;
  const requestUser = req.user
  try {
    // 1. Validar que el usuario no exista
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    // 2. Buscar el rol y validar si el clinicId es requerido
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).json({ message: "El rol especificado no existe." });
    }

    if (role.name !== 'patient' && !clinicId && role.name !== 'superAdmin') {
      return res.status(400).json({ message: "El ID de la clínica es requerido para este rol." });
    }

    // 3. Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Crear el nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role._id,
      clinic: (clinicId == null && roleName == "patient") ? requestUser.clinicId : clinicId || null,
    });
    await newUser.save();

    // 5. Lógica post-registro según el rol
    if (role.name === 'patient') {
      console.log("do nothing")
    } else {
      const clinic = await Clinic.findById(clinicId);
      if (!clinic && role.name !== 'superAdmin') {
        return res.status(404).json({ message: "Clínica no encontrada." });
      }

      // Actualizar la lista de doctores o staff en la clínica      
      if (role.name === 'admin') {
        clinic.admin = newUser._id;
      }
      else if (role.name === 'doctor') {
        clinic.doctors.push(newUser._id);
      } else if (role.name === 'receptionist') {
        clinic.staff.push(newUser._id);
      }
      await clinic.save();
    }

    res.status(201).json({
      message: "Usuario registrado con éxito.",
      user: {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: role.name,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Autentica un usuario y devuelve un token JWT.
 * @access  Public
 */
api.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por email
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // 2. Comparar la contraseña ingresada con la guardada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // 3. Generar un token JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role.name,
        clinicId: user.clinic
      }
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Autenticación exitosa.",
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name
      }
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

export default api;