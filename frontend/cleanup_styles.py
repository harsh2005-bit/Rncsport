
import os

file_path = r'c:\Users\harsh\OneDrive\Desktop\Jsr\frontend\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Densify Hero Metrics if they exist
content = content.replace('rounded-[2.4rem] p-8 space-y-6 w-72', 'rounded-3xl p-6 space-y-4 w-64')

# 2. Add Search Bar to Hero (before the paragraph)
search_bar = """
            <div className="relative max-w-lg group/search">
               <div className="absolute inset-0 bg-primary/5 blur-xl group-hover/search:bg-primary/10 transition-all" />
               <input 
                  type="text" 
                  placeholder="Search matches, leagues, or casino..." 
                  className="relative w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-medium text-white focus:border-primary/40 transition-all outline-hidden backdrop-blur-md"
               />
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover/search:text-primary/60 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
            </div>
"""
if '<p className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-lg font-poppins">' in content:
    content = content.replace('<p className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-lg font-poppins">', 
                             search_bar + '\n            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-lg font-poppins">')

# 3. Refine Match Card with "Odds" grid
odds_section = """
                 <div className="grid grid-cols-3 gap-2">
                    {[1, 'X', 2].map(type => (
                       <div key={type} className="p-2 bg-white/5 rounded-lg text-center cursor-pointer hover:bg-primary border border-transparent hover:border-primary transition-all group/odd">
                          <p className="text-[7px] text-white/40 uppercase font-black group-hover/odd:text-black">{type}</p>
                          <p className="text-[11px] font-black text-primary group-hover/odd:text-black">{(1.5 + Math.random() * 2).toFixed(2)}</p>
                       </div>
                    ))}
                 </div>
"""

# Find where to insert odds (before the bet buttons)
content = content.replace('<div className="pt-4 border-t border-white/5 flex gap-3">', 
                         odds_section + '\n                 <div className="pt-3 border-t border-white/5 flex gap-2">')

# 4. Final VIP & Exchange Densification
content = content.replace('rounded-[4rem] p-[2px] overflow-hidden shadow-3xl transition-all', 'rounded-3xl p-[1px] overflow-hidden shadow-2xl transition-all')
content = content.replace('rounded-[2.9rem] p-8 flex flex-col items-center border border-white/5', 'rounded-3xl p-6 flex flex-col items-center border border-white/5')
content = content.replace('p-16 glass rounded-[4rem] hover:border-primary/40', 'p-8 bg-white/[0.02] rounded-3xl border border-white/5')
content = content.replace('w-32 h-32 mb-12 rounded-[2.5rem]', 'w-20 h-20 mb-6 rounded-2xl')

# Fix linting for buttons
content = content.replace('rounded-[2rem]', 'rounded-xl')
content = content.replace('rounded-[1.5rem]', 'rounded-lg')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pro-betting style cleanup complete.")
