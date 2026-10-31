import type { SiteConfig } from './types';

/**
 * CONFIGURAÇÃO COMERCIAL E INSTITUCIONAL - ANIMAL FRESH
 * 
 * Centralização de variáveis comerciais do produto e da loja.
 * Caso valores como Preço Real ou Link de Checkout venham de variáveis de ambiente,
 * CMS ou plataforma de e-commerce (Shopify, Yampi, Nuvemshop, etc.),
 * atualize as constantes abaixo.
 */
export const SITE_CONFIG: SiteConfig = {
  brandName: 'Animal Fresh',
  slogan: 'Água fresca. Amor em cada gole.',
  supportEmail: 'contato@animalfresh.com.br',
  supportHours: 'Segunda a Sexta, das 9h às 18h',

  product: {
    name: 'Bebedouro Inox Flow Wireless',
    tagline: 'Água fresca. Amor em cada gole.',
    color: 'Branco',
    capacity: '4 litros',
    material: 'Cuba superior em Aço Inoxidável cirúrgico + Base em ABS de alta densidade',
    badgeText: 'BRANCO • INOX • 4 LITROS',
    
    // Status de configuração comercial
    isPriceConfigured: true,
    price: 'R$ 399,90',
    installments: 'em até 12x no cartão de crédito • Frete Grátis para todo o Brasil',
    originalPrice: undefined, // Sem preço riscado fictício, respeitando as diretrizes de integridade
    
    // URL de checkout real (ou plataforma conectada)
    isCheckoutConfigured: true,
    checkoutUrl: 'https://pay.kaiross.com.br/OpnJ5CwS5eMA',
    
    shippingInfo: 'Frete Grátis com código de rastreamento para todo o território nacional.',
    warrantyInfo: 'Garantia legal de 90 dias contra defeitos de fabricação, conforme o CDC.',
    paymentMethods: ['PIX com aprovação imediata', 'Cartão de crédito em até 12x', 'Boleto bancário'],
  },

  faqs: [
    {
      id: 'faq-1',
      question: 'Qual é a capacidade do Bebedouro Inox Flow Wireless?',
      answer:
        'O reservatório do modelo possui capacidade nominal de 4 litros, oferecendo autonomia prolongada de água fresca e reduzindo a necessidade de reabastecimentos diários frequentes.',
    },
    {
      id: 'faq-2',
      question: 'O bebedouro funciona sem fio?',
      answer:
        'Sim. O modelo conta com módulo de alimentação wireless recarregável de 4000mAh com conexão Type-C, permitindo posicionamento sem fios em qualquer ambiente da casa sem cabos expostos pelo chão.',
    },
    {
      id: 'faq-3',
      question: 'Como faço a limpeza e a manutenção?',
      answer:
        'A cuba superior em aço inoxidável e o reservatório são destacáveis para fácil higienização com esponja macia e detergente neutro. O módulo elétrico é independente e não deve ser imerso em água. Recomenda-se a limpeza semanal do conjunto.',
    },
    {
      id: 'faq-4',
      question: 'O filtro acompanha o produto?',
      answer:
        'O produto é fornecido com sistema de filtragem de múltiplos estágios para retenção de pelos e impurezas. As informações sobre periodicidade de troca e refis adicionais acompanham o manual do fabricante.',
    },
    {
      id: 'faq-5',
      question: 'O que vem na embalagem?',
      answer:
        'A embalagem original inclui: 1 Bebedouro Animal Fresh Flow Wireless com cuba em inox, 1 módulo motor/bomba independente, 1 refil de filtro inicial, cabo de carregamento USB Type-C e manual de instruções em português.',
    },
    {
      id: 'faq-6',
      question: 'Como funciona a garantia?',
      answer:
        'Todos os produtos comercializados possuem garantia legal de 90 dias contra quaisquer defeitos de fabricação a contar da data de recebimento, conforme estipulado pelo Código de Defesa do Consumidor.',
    },
    {
      id: 'faq-7',
      question: 'Qual é o prazo de entrega?',
      answer:
        'O prazo de entrega e as transportadoras disponíveis variam de acordo com a sua região e CEP de destino, sendo calculados com precisão no momento do checkout com envio de código de rastreio por e-mail.',
    },
    {
      id: 'faq-8',
      question: 'Como posso solicitar troca ou devolução?',
      answer:
        'Você pode exercer o direito de arrependimento em até 7 dias corridos após o recebimento da mercadoria. O produto deve estar em sua embalagem original, sem marcas de uso, acompanhado de todos os componentes.',
    },
  ],
};
