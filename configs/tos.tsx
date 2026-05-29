import { site } from '@/configs/site';

export interface TOSSection {
  id: string;
  title: string;
  content: string[];
}

export const TOS_Section: TOSSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: [
      `By downloading, installing, or using ${site.name} ("the Software"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Software.`,
      'These terms apply to all users of the Software, including contributors, end-users, and any party that accesses or uses the Software in any manner.',
    ]
  },
  {
    id: 'license',
    title: '2. License & Open Source',
    content: [
      `${site.name} is open-source software. Your use of the Software is governed by the applicable open-source license included in the repository. These Terms of Service exist alongside that license and do not supersede it.`,
      'You are granted a non-exclusive, non-transferable, revocable license to use the Software for personal, educational, or commercial purposes in accordance with the open-source license terms.',
      'You may not sublicense, sell, or distribute modified versions of the Software under a different name or brand without clear attribution to the original project.',
    ]
  },
  {
    id: 'user-content',
    title: '3. User-Created Content & Scripts',
    content: [
      `${site.name} provides a Lua scripting environment for creating games, experiences, and applications ("User Content"). You retain full ownership of any User Content you create using the Software.`,
      `${site.author} claims no ownership over User Content created with ${site.name}. However, you are solely responsible for ensuring your User Content complies with all applicable laws and does not infringe on the rights of third parties.`,
      'You must not use the scripting environment to create or distribute malicious software, exploit tools, or any content designed to harm, deceive, or defraud others.',
    ]
  },
  {
    id: 'prohibited',
    title: '4. Prohibited Use',
    content: [
      'You agree not to use the Software to: create, distribute, or host any content that is illegal, harmful, abusive, harassing, defamatory, or otherwise objectionable under applicable law.',
      'You agree not to use the Software to: reverse-engineer, decompile, or attempt to extract proprietary source components beyond what is already provided under the open-source license.',
      'You agree not to use the Software to: conduct attacks, unauthorized intrusions, or any activity that interferes with the operation of networks, servers, or third-party services.',
      `You agree not to use the Software to: impersonate ${site.author}, ${site.name}, or any contributor in any misleading or fraudulent manner.`,
    ]
  },
  {
    id: 'disclaimer',
    title: '5. Disclaimer of Warranties',
    content: [
      'THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.',
      `${site.author} does not warrant that the Software will be error-free, uninterrupted, secure, or free of harmful components. Use of the Software is at your own risk.`,
      `${site.author} makes no guarantees regarding uptime, data integrity, or the continued availability of any features, APIs, or services provided by or through the Software.`,
    ]
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    content: [
      `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ${site.author}, its contributors, maintainers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Software.`,
      `This includes, without limitation, loss of data, loss of profits, business interruption, or any other damages, even if ${site.author} has been advised of the possibility of such damages.`,
      `In jurisdictions that do not allow the exclusion of certain warranties or limitation of liability, ${site.author}'s liability shall be limited to the maximum extent permitted by law.`,
    ]
  },
  {
    id: 'third-party',
    title: '7. Third-Party Components',
    content: [
      `${site.name} integrates third-party libraries, engines, and tools (including Godot Engine, Lua, and others). Your use of these components is subject to their respective licenses and terms.`,
      `${site.author} is not responsible for the behavior, security, or availability of any third-party components. You assume all risk associated with their use.`,
    ]
  },
  {
    id: 'contributions',
    title: '8. Contributions',
    content: [
      `By submitting code, documentation, or other materials to the ${site.name} repository, you grant ${site.author} a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your contributions under the project's open-source license.`,
      'You represent that you have the right to make such contributions and that they do not infringe on any third-party rights.',
    ]
  },
  {
    id: 'modifications',
    title: '9. Modifications to Terms',
    content: [
      `${site.author} reserves the right to modify these Terms of Service at any time. Changes will be reflected by updating the effective date at the top of this page.`,
      'Continued use of the Software after any modifications constitutes your acceptance of the updated terms. It is your responsibility to review these terms periodically.',
    ]
  },
  {
    id: 'governing',
    title: '10. Governing Law',
    content: [
      'These Terms of Service shall be governed by and construed in accordance with applicable law, without regard to conflict of law provisions.',
      `Any disputes arising from these terms or your use of the Software shall be resolved through good-faith negotiation where possible. ${site.author} reserves all legal rights.`,
    ]
  },
  {
    id: 'contact',
    title: '11. Contact',
    content: [
      `For questions regarding these Terms of Service, please open an issue or discussion on the official ${site.name} GitHub repository at ${site.git.sandbox.user}/${site.git.sandbox.repo}.`,
    ]
  }
];