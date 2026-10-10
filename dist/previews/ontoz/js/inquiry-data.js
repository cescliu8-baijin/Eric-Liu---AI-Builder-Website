// Local demo fixtures. Account IDs are stable and scope all messaging state.
const inquiryAccounts = [
  { id: 'mail-sales', channel: 'email', name: '销售邮箱', senderName: 'John', address: 'sales@ontoz.ai' },
  { id: 'wa-john', channel: 'whatsapp', name: 'John · 国际销售', senderName: 'John', address: '+86 138 0000 2188' },
  { id: 'wa-elsa', channel: 'whatsapp', name: 'Elsa · 欧洲市场', senderName: 'Elsa', address: '+86 138 0000 3199' },
  { id: 'wab-sales', channel: 'whatsapp-business', name: 'OntoZ · 企业销售', senderName: 'OntoZ Sales', address: '+86 400 800 2188' },
  { id: 'wab-service', channel: 'whatsapp-business', name: 'OntoZ · 客户服务', senderName: 'OntoZ Support', address: '+86 400 800 2199' }
];
const inquiryContacts = [
  { id: 'mia', accountId: 'wa-john', name: 'Mia Thompson', company: 'Northstar Handling Ltd.', phone: '+44 7700 900 215', role: 'Operations Director', tone: 'green', profileId: 'mia-whatsapp' },
  { id: 'james', accountId: 'wa-john', name: 'James Wilson', company: 'Northstar Handling Ltd.', phone: '+44 7700 900 318', role: 'Purchasing Specialist', tone: 'blue' },
  { id: 'sophie', accountId: 'wa-john', name: 'Sophie Chen', company: 'Atlas Logistics', phone: '+65 8123 4567', role: 'Project Manager', tone: 'amber' },
  { id: 'mark', accountId: 'wa-elsa', name: 'Mark Jensen', company: 'Nordic Light A/S', phone: '+45 20 12 34 56', role: 'Procurement Manager', tone: 'blue' },
  { id: 'anna', accountId: 'wa-elsa', name: 'Anna Fischer', company: 'Klein Industriebedarf GmbH', phone: '+49 151 2345 6789', role: 'Operations Manager', tone: 'amber' },
  { id: 'daniel', accountId: 'wa-elsa', name: 'Daniel Weber', company: 'Weber Automation', phone: '+49 151 3456 7890', role: 'Technical Lead', tone: 'green' },
  { id: 'ava-business', accountId: 'wab-sales', name: 'Ava Martinez', company: 'LogiCore Solutions', phone: '+52 55 1234 5678', role: 'Supply Chain Lead', tone: 'blue', profileId: 'ava-linkedin' },
  { id: 'carlos', accountId: 'wab-sales', name: 'Carlos Rivera', company: 'LogiCore Solutions', phone: '+52 55 2345 6789', role: 'Procurement Manager', tone: 'green' },
  { id: 'emma', accountId: 'wab-sales', name: 'Emma Brown', company: 'Pacific Distribution', phone: '+61 412 345 678', role: 'Managing Director', tone: 'amber' },
  { id: 'leo-service', accountId: 'wab-service', name: 'Leo Park', company: 'Seoul Logistics', phone: '+82 10 1234 5678', role: 'Service Coordinator', tone: 'green' },
  { id: 'nina-service', accountId: 'wab-service', name: 'Nina Kim', company: 'Seoul Logistics', phone: '+82 10 2345 6789', role: 'Operations Manager', tone: 'blue' }
];
function createInquiryContactConversation(contact) {
  const account = inquiryAccounts.find(item => item.id === contact.accountId);
  return {
    id: `${account.id}-${contact.id}`, accountId: account.id, contactId: contact.id,
    profileId: contact.profileId, name: contact.name, firstName: contact.name.split(' ')[0],
    avatar: contact.name[0], avatarTone: contact.tone, company: contact.company, role: contact.role,
    channel: account.channel, channelLabel: account.channel === 'whatsapp' ? 'WhatsApp' : 'WhatsApp 企业号',
    channelAccount: account.address, identity: contact.phone, time: '刚刚', unread: 0,
    lastPreview: '开始新的对话', messages: []
  };
}
inquiryDemoConversations.forEach(conversation => {
  if (conversation.channel === 'email') conversation.accountId = 'mail-sales';
  if (conversation.id === 'mia-whatsapp') {
    conversation.accountId = 'wa-john';
    conversation.contactId = 'mia';
  }
});
[
  ['mark', 'Hi Elsa, could you send the updated product specifications?', 2, '11:42'],
  ['ava-business', 'Could we discuss a distributor program for Mexico?', 2, '14:08'],
  ['leo-service', 'Thank you for the maintenance guide. Everything is working well.', 0, '09:30']
].forEach(([contactId, text, unread, time]) => {
  const conversation = createInquiryContactConversation(inquiryContacts.find(item => item.id === contactId));
  Object.assign(conversation, { unread, time, lastPreview: text, messages: [{ id: `${contactId}-hello`, direction: 'inbound', date: '今天', time, text }] });
  inquiryDemoConversations.push(conversation);
});
inquiryDemoConversations.push({
  id: 'wa-john-northstar-group', accountId: 'wa-john', channel: 'whatsapp', channelLabel: 'WhatsApp',
  channelAccount: '+86 138 0000 2188', name: 'Northstar · 采购项目组', firstName: 'Northstar 项目组',
  avatar: 'N', avatarTone: 'green', company: '群组 · 3 位成员', role: '项目沟通', identity: '',
  isGroup: true, memberIds: ['mia', 'james'], time: '10:25', unread: 0,
  lastPreview: 'Mia: Let’s confirm the delivery schedule here.',
  messages: [{ id: 'northstar-1', direction: 'inbound', sender: 'Mia Thompson', date: '今天', time: '10:25', text: 'Let’s confirm the delivery schedule here.' }]
});
