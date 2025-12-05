import { BlogPost } from '../api/wordpress'

export const MOCKUP_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'guia-completa-pesca-mosca-principiantes',
    title: 'Guía Completa de Pesca con Mosca para Principiantes',
    excerpt: 'Todo lo que necesitas saber para comenzar en el mundo de la pesca con mosca. Desde el equipo básico hasta las técnicas fundamentales de lanzamiento.',
    content: `
      <p>La pesca con mosca es una de las formas más gratificantes de conectar con la naturaleza. En esta guía te llevaremos paso a paso por todo lo que necesitas saber para comenzar.</p>

      <h2>¿Qué es la pesca con mosca?</h2>
      <p>A diferencia de la pesca tradicional con señuelos pesados, la pesca con mosca utiliza moscas artificiales ultralivianas que imitan insectos y otras presas naturales de los peces.</p>

      <h2>Equipo básico necesario</h2>
      <ul>
        <li><strong>Caña de mosca:</strong> Para principiantes, recomendamos una caña #5 o #6 de 9 pies</li>
        <li><strong>Carrete:</strong> Un carrete que balancee con tu caña</li>
        <li><strong>Línea:</strong> Weight Forward (WF) floating es ideal para empezar</li>
        <li><strong>Leader y tippet:</strong> Para conectar la línea con la mosca</li>
        <li><strong>Moscas:</strong> Un set básico de secas, ninfas y streamers</li>
      </ul>

      <h2>Técnicas de lanzamiento</h2>
      <p>El lanzamiento básico consta de dos movimientos: el backcast y el forward cast. La clave está en dejar que la línea se cargue completamente antes de cambiar de dirección.</p>

      <blockquote>
        "La pesca con mosca no es solo un deporte, es una forma de vida que te conecta con los ritmos de la naturaleza."
      </blockquote>

      <h2>Conclusión</h2>
      <p>Comenzar en la pesca con mosca puede parecer intimidante, pero con paciencia y práctica, pronto estarás disfrutando de este maravilloso deporte. ¡Nos vemos en el río!</p>
    `,
    date: '2024-01-15T10:00:00',
    imageUrl: '/images/categories/nudos.jpg',
    imageAlt: 'Equipo de pesca con mosca',
    categories: [{ id: 1, name: 'Guías', slug: 'guias' }],
    author: { name: 'Planeta Outdoor', avatar: '' },
    readTime: 8,
  },
  {
    id: 2,
    slug: 'mejores-rios-pesca-mosca-chile',
    title: 'Los 10 Mejores Ríos para Pesca con Mosca en Chile',
    excerpt: 'Descubre los destinos más increíbles para la pesca con mosca en Chile, desde la Araucanía hasta la Patagonia. Truchas arcoíris, marrones y fario te esperan.',
    content: `
      <p>Chile es reconocido mundialmente como uno de los mejores destinos para la pesca con mosca. Sus ríos cristalinos y truchas salvajes atraen a pescadores de todo el mundo.</p>

      <h2>1. Río Futaleufú</h2>
      <p>Conocido por sus aguas turquesas y truchas de gran tamaño. La mejor época es de noviembre a abril.</p>

      <h2>2. Río Simpson</h2>
      <p>En la Región de Aysén, ofrece excelente pesca de truchas marrones y arcoíris en un entorno prístino.</p>

      <h2>3. Río Palena</h2>
      <p>Un río salvaje con acceso limitado que garantiza truchas vírgenes y paisajes espectaculares.</p>

      <h2>4. Río Yelcho</h2>
      <p>Famoso por sus truchas marrones trophy. Requiere buen manejo del streamer.</p>

      <h2>5. Río Baker</h2>
      <p>El río más caudaloso de Chile, hogar de truchas arcoíris y marrones de tamaño excepcional.</p>
    `,
    date: '2024-01-10T14:30:00',
    imageUrl: '/images/categories/canas.jpg',
    imageAlt: 'Caña de pesca en muelle con lago',
    categories: [{ id: 2, name: 'Destinos', slug: 'destinos' }],
    author: { name: 'Planeta Outdoor', avatar: '' },
    readTime: 10,
  },
  {
    id: 3,
    slug: 'como-elegir-waders-perfectos',
    title: 'Cómo Elegir los Waders Perfectos para Ti',
    excerpt: 'Neopreno vs. tela respirable, botas integradas vs. calcetín. Te ayudamos a elegir los waders ideales según tu tipo de pesca y presupuesto.',
    content: `
      <p>Los waders son una de las inversiones más importantes para cualquier pescador con mosca. Elegir los correctos puede marcar la diferencia entre un día memorable y uno miserable.</p>

      <h2>Tipos de waders</h2>

      <h3>Waders de neopreno</h3>
      <p>Ideales para aguas muy frías. Ofrecen excelente aislamiento térmico pero pueden ser calurosos en verano.</p>

      <h3>Waders de tela respirable</h3>
      <p>La opción más versátil. Permiten regular la temperatura con capas de ropa interior.</p>

      <h2>¿Botas integradas o calcetín?</h2>
      <p>Los waders con calcetín (stockingfoot) ofrecen mayor versatilidad ya que puedes elegir las botas por separado, pero requieren una inversión adicional.</p>

      <h2>Consejos para elegir la talla</h2>
      <ul>
        <li>Mide tu altura y contorno de pecho</li>
        <li>Considera el espacio para capas de ropa</li>
        <li>Prueba sentarte y levantar las rodillas</li>
      </ul>
    `,
    date: '2024-01-05T09:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop',
    imageAlt: 'Pescador con waders en río',
    categories: [{ id: 3, name: 'Equipamiento', slug: 'equipamiento' }],
    author: { name: 'Planeta Outdoor', avatar: '' },
    readTime: 6,
  },
  {
    id: 4,
    slug: 'moscas-esenciales-temporada-verano',
    title: '15 Moscas Esenciales para la Temporada de Verano',
    excerpt: 'Las moscas que no pueden faltar en tu caja durante los meses de verano. Patrones probados que funcionan en los ríos chilenos.',
    content: `
      <p>El verano es la época dorada para la pesca con mosca seca. Las eclosiones son frecuentes y las truchas están activas en superficie.</p>

      <h2>Moscas Secas</h2>
      <ol>
        <li><strong>Adams #14-18:</strong> El patrón más versátil</li>
        <li><strong>Elk Hair Caddis #12-16:</strong> Imita tricópteros</li>
        <li><strong>Royal Wulff #10-14:</strong> Alta flotabilidad</li>
        <li><strong>Chernobyl Ant #8-10:</strong> Para días de calor</li>
        <li><strong>Stimulator #10-14:</strong> Excelente buscadora</li>
      </ol>

      <h2>Ninfas</h2>
      <ol>
        <li><strong>Pheasant Tail #14-18:</strong> Imitación de mayfly</li>
        <li><strong>Hare's Ear #12-16:</strong> Patrón multiuso</li>
        <li><strong>Prince Nymph #12-16:</strong> Muy efectiva</li>
      </ol>

      <h2>Streamers</h2>
      <ol>
        <li><strong>Woolly Bugger Negro #6-10:</strong> El clásico</li>
        <li><strong>Zonker #4-8:</strong> Imita pececillos</li>
      </ol>
    `,
    date: '2023-12-28T11:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
    imageAlt: 'Caja de moscas para pesca',
    categories: [{ id: 4, name: 'Moscas', slug: 'moscas' }],
    author: { name: 'Planeta Outdoor', avatar: '' },
    readTime: 7,
  },
  {
    id: 5,
    slug: 'tecnicas-nymphing-europeo',
    title: 'Técnicas de Nymphing Europeo: La Revolución en la Pesca',
    excerpt: 'Aprende las técnicas de nymphing que están revolucionando la pesca con mosca. Euro nymphing, tight line y más.',
    content: `
      <p>El nymphing europeo ha transformado la forma en que pescamos. Estas técnicas, desarrolladas en competencias internacionales, son devastadoramente efectivas.</p>

      <h2>¿Qué es el Euro Nymphing?</h2>
      <p>Es una técnica de pesca con ninfas que utiliza líneas muy finas y contacto directo con las moscas, permitiendo detectar picadas sutiles.</p>

      <h2>Equipo necesario</h2>
      <ul>
        <li>Caña larga (10-11 pies) de acción sensible</li>
        <li>Línea de competencia o mono rig</li>
        <li>Leaders largos y finos</li>
        <li>Ninfas lastradas (jig nymphs)</li>
      </ul>

      <h2>Técnicas principales</h2>
      <h3>Czech Nymphing</h3>
      <p>Pesca a corta distancia con deriva natural.</p>

      <h3>French Nymphing</h3>
      <p>Utiliza leaders más largos para mayor distancia.</p>

      <h3>Spanish Nymphing</h3>
      <p>Combinación de técnicas con énfasis en la presentación.</p>
    `,
    date: '2023-12-20T16:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=800&fit=crop',
    imageAlt: 'Pescador practicando euro nymphing',
    categories: [{ id: 5, name: 'Técnicas', slug: 'tecnicas' }],
    author: { name: 'Planeta Outdoor', avatar: '' },
    readTime: 9,
  },
  {
    id: 6,
    slug: 'conservacion-rios-patagonia',
    title: 'Conservación de Ríos: Protegiendo la Patagonia',
    excerpt: 'La importancia de preservar nuestros ríos para las futuras generaciones. Prácticas de catch and release y conservación del hábitat.',
    content: `
      <p>Los ríos de la Patagonia son un tesoro natural que debemos proteger. Como pescadores, tenemos la responsabilidad de ser guardianes de estos ecosistemas.</p>

      <h2>Catch and Release responsable</h2>
      <ul>
        <li>Usa anzuelos sin rebaba</li>
        <li>Manipula el pez con manos mojadas</li>
        <li>Mantén el pez en el agua el mayor tiempo posible</li>
        <li>Revive al pez antes de soltarlo</li>
      </ul>

      <h2>Impacto del cambio climático</h2>
      <p>Los ríos patagónicos enfrentan amenazas por el aumento de temperaturas y cambios en los patrones de precipitación.</p>

      <h2>Cómo puedes ayudar</h2>
      <ul>
        <li>Apoya organizaciones de conservación</li>
        <li>Practica "Leave No Trace"</li>
        <li>Reporta actividades ilegales</li>
        <li>Educa a otros pescadores</li>
      </ul>

      <blockquote>
        "No heredamos los ríos de nuestros padres, los tomamos prestados de nuestros hijos."
      </blockquote>
    `,
    date: '2023-12-15T08:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=800&fit=crop',
    imageAlt: 'Paisaje prístino de la Patagonia',
    categories: [{ id: 6, name: 'Conservación', slug: 'conservacion' }],
    author: { name: 'Planeta Outdoor', avatar: '' },
    readTime: 5,
  },
]

export const MOCKUP_CATEGORIES = [
  { id: 1, name: 'Guías', slug: 'guias', count: 1 },
  { id: 2, name: 'Destinos', slug: 'destinos', count: 1 },
  { id: 3, name: 'Equipamiento', slug: 'equipamiento', count: 1 },
  { id: 4, name: 'Moscas', slug: 'moscas', count: 1 },
  { id: 5, name: 'Técnicas', slug: 'tecnicas', count: 1 },
  { id: 6, name: 'Conservación', slug: 'conservacion', count: 1 },
]
