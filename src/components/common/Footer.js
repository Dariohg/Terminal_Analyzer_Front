import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Logo y descripción */}
                    <div className="flex items-center space-x-2">
                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Terminal Analyzer</p>
                            <p className="text-xs text-gray-500">
                                Analizador de seguridad para historiales de terminal
                            </p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-600">
                            © {currentYear} Terminal Analyzer. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Desarrollado con Go + React
                        </p>
                    </div>
                </div>

                {/* Links adicionales */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500">
                        <span>Análisis Léxico</span>
                        <span>•</span>
                        <span>Análisis Sintáctico</span>
                        <span>•</span>
                        <span>Análisis Semántico</span>
                        <span>•</span>
                        <span>Detección de Amenazas</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;