-- Quiz Questions for Environmental Education Platform
-- 4 quizzes with 10 questions each

-- Quiz 1: Sustainable Development Goals (Quiz ID: 1)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, difficulty, points, order_index) VALUES

(1, 'How many Sustainable Development Goals (SDGs) were adopted by the United Nations in 2015?', 'multiple_choice', 
'["15 goals", "17 goals", "20 goals", "25 goals"]', 
'17 goals', 
'The UN adopted 17 Sustainable Development Goals in 2015 as a universal call to action to end poverty, protect the planet, and ensure prosperity for all by 2030.', 
'easy', 10, 1),

(1, 'Which SDG specifically focuses on "Clean Water and Sanitation"?', 'multiple_choice',
'["SDG 5", "SDG 6", "SDG 8", "SDG 12"]',
'SDG 6',
'SDG 6 aims to ensure availability and sustainable management of water and sanitation for all, addressing water scarcity, quality, and access issues globally.',
'medium', 10, 2),

(1, 'What is the main target year for achieving the Sustainable Development Goals?', 'multiple_choice',
'["2025", "2030", "2035", "2040"]',
'2030',
'The SDGs are designed to be achieved by 2030, giving countries 15 years from their adoption in 2015 to work towards these global goals.',
'easy', 10, 3),

(1, 'Which SDG addresses "Climate Action"?', 'multiple_choice',
'["SDG 11", "SDG 13", "SDG 14", "SDG 15"]',
'SDG 13',
'SDG 13 focuses on taking urgent action to combat climate change and its impacts, including strengthening resilience and adaptive capacity.',
'medium', 10, 4),

(1, 'The concept of "Leave No One Behind" is central to which aspect of the SDGs?', 'multiple_choice',
'["Economic growth only", "Environmental protection only", "Inclusive development for all", "Technology advancement only"]',
'Inclusive development for all',
'The SDGs emphasize inclusive development that reaches the most vulnerable and marginalized populations, ensuring no one is left behind in progress.',
'medium', 10, 5),

(1, 'Which SDG focuses on "Responsible Consumption and Production"?', 'multiple_choice',
'["SDG 10", "SDG 12", "SDG 14", "SDG 16"]',
'SDG 12',
'SDG 12 aims to ensure sustainable consumption and production patterns, promoting resource efficiency and reducing waste generation.',
'medium', 10, 6),

(1, 'What percentage of global greenhouse gas emissions comes from cities according to UN estimates?', 'multiple_choice',
'["50-60%", "60-70%", "70-80%", "80-90%"]',
'70-80%',
'Cities consume over 70% of global energy and produce more than 70% of global CO2 emissions, making urban sustainability crucial for climate action.',
'hard', 10, 7),

(1, 'Which SDG specifically addresses "Life Below Water"?', 'multiple_choice',
'["SDG 13", "SDG 14", "SDG 15", "SDG 16"]',
'SDG 14',
'SDG 14 focuses on conserving and sustainably using oceans, seas, and marine resources, addressing issues like marine pollution and overfishing.',
'easy', 10, 8),

(1, 'The "Triple Bottom Line" approach in sustainable development considers which three factors?', 'multiple_choice',
'["People, Planet, Profit", "Health, Wealth, Wisdom", "Economy, Society, Technology", "Past, Present, Future"]',
'People, Planet, Profit',
'The triple bottom line framework evaluates company performance based on social (People), environmental (Planet), and economic (Profit) impacts.',
'hard', 10, 9),

(1, 'Which principle emphasizes meeting present needs without compromising future generations ability to meet their needs?', 'multiple_choice',
'["Circular Economy", "Green Growth", "Sustainable Development", "Environmental Justice"]',
'Sustainable Development',
'This is the classic definition of sustainable development from the 1987 Brundtland Report, emphasizing intergenerational equity and responsibility.',
'medium', 10, 10);

-- Quiz 2: Environmental Protection Basics (Quiz ID: 2)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, difficulty, points, order_index) VALUES

(2, 'What is biodiversity?', 'multiple_choice',
'["The variety of plant species only", "The variety of animal species only", "The variety of all living organisms and ecosystems", "The number of trees in a forest"]',
'The variety of all living organisms and ecosystems',
'Biodiversity refers to the variety of life on Earth, including genetic diversity within species, species diversity, and ecosystem diversity.',
'easy', 10, 1),

(2, 'Which gas is primarily responsible for the depletion of the ozone layer?', 'multiple_choice',
'["Carbon dioxide (CO2)", "Methane (CH4)", "Chlorofluorocarbons (CFCs)", "Nitrous oxide (N2O)"]',
'Chlorofluorocarbons (CFCs)',
'CFCs were widely used in refrigerants and aerosols but break down ozone molecules in the stratosphere, creating the ozone hole.',
'medium', 10, 2),

(2, 'What is the main cause of acid rain?', 'multiple_choice',
'["Volcanic eruptions", "Forest fires", "Burning fossil fuels", "Ocean pollution"]',
'Burning fossil fuels',
'Acid rain is primarily caused by sulfur dioxide and nitrogen oxides released from burning fossil fuels, which react with water in the atmosphere.',
'medium', 10, 3),

(2, 'Which ecosystem is known as the "lungs of the Earth"?', 'multiple_choice',
'["Coral reefs", "Tropical rainforests", "Grasslands", "Deserts"]',
'Tropical rainforests',
'Tropical rainforests, especially the Amazon, produce about 20% of the world oxygen and absorb large amounts of carbon dioxide.',
'easy', 10, 4),

(2, 'What is eutrophication?', 'multiple_choice',
'["Soil erosion process", "Water pollution causing algae overgrowth", "Air pollution in cities", "Deforestation in tropical areas"]',
'Water pollution causing algae overgrowth',
'Eutrophication occurs when water bodies receive excess nutrients (especially nitrogen and phosphorus), leading to algae blooms and oxygen depletion.',
'hard', 10, 5),

(2, 'Which of these is a renewable energy source?', 'multiple_choice',
'["Coal", "Natural gas", "Solar power", "Nuclear energy"]',
'Solar power',
'Solar power harnesses energy from the sun, which is naturally replenished and will be available for billions of years.',
'easy', 10, 6),

(2, 'What does the term "carbon footprint" refer to?', 'multiple_choice',
'["The size of carbon atoms", "Total greenhouse gas emissions from activities", "Carbon deposits in soil", "Footprints left by carbon-based life"]',
'Total greenhouse gas emissions from activities',
'Carbon footprint measures the total amount of greenhouse gases produced directly or indirectly by human activities, expressed as CO2 equivalent.',
'medium', 10, 7),

(2, 'Which practice helps reduce water pollution?', 'multiple_choice',
'["Using more pesticides", "Dumping waste in rivers", "Treating wastewater before discharge", "Increasing industrial runoff"]',
'Treating wastewater before discharge',
'Wastewater treatment removes pollutants and contaminants before water is released back into the environment, protecting water quality.',
'easy', 10, 8),

(2, 'What is the primary benefit of composting?', 'multiple_choice',
'["Reduces landfill waste and creates fertile soil", "Increases plastic production", "Generates more packaging", "Creates more methane gas"]',
'Reduces landfill waste and creates fertile soil',
'Composting organic waste reduces landfill burden, decreases methane emissions, and produces nutrient-rich soil amendment for plants.',
'medium', 10, 9),

(2, 'Which international agreement aims to combat climate change?', 'multiple_choice',
'["Montreal Protocol", "Paris Agreement", "Kyoto Treaty", "Basel Convention"]',
'Paris Agreement',
'The Paris Agreement is a legally binding international treaty on climate change adopted in 2015, aiming to limit global warming to below 2°C.',
'medium', 10, 10);

-- Quiz 3: Climate Change Science (Quiz ID: 3)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, difficulty, points, order_index) VALUES

(3, 'What is the greenhouse effect?', 'multiple_choice',
'["Cooling of Earth atmosphere", "Trapping of heat in Earth atmosphere", "Formation of ice sheets", "Ocean currents changing direction"]',
'Trapping of heat in Earth atmosphere',
'The greenhouse effect occurs when certain gases in the atmosphere trap heat from the sun, keeping Earth warm enough to support life.',
'easy', 10, 1),

(3, 'Which greenhouse gas has the highest concentration in the atmosphere?', 'multiple_choice',
'["Methane (CH4)", "Carbon dioxide (CO2)", "Nitrous oxide (N2O)", "Fluorinated gases"]',
'Carbon dioxide (CO2)',
'CO2 makes up about 76% of total greenhouse gas emissions and has the highest concentration among greenhouse gases in the atmosphere.',
'easy', 10, 2),

(3, 'What is the current atmospheric CO2 concentration (as of 2024)?', 'multiple_choice',
'["350 ppm", "400 ppm", "420+ ppm", "500 ppm"]',
'420+ ppm',
'Atmospheric CO2 levels have exceeded 420 parts per million, the highest in over 3 million years, indicating rapid climate change.',
'hard', 10, 3),

(3, 'Which human activity contributes most to global greenhouse gas emissions?', 'multiple_choice',
'["Agriculture", "Transportation", "Energy production (electricity/heat)", "Industrial processes"]',
'Energy production (electricity/heat)',
'Energy production for electricity and heat accounts for about 25% of global greenhouse gas emissions, making it the largest single source.',
'medium', 10, 4),

(3, 'What is climate feedback?', 'multiple_choice',
'["Weather patterns repeating", "Climate systems amplifying or dampening changes", "Seasonal temperature variations", "Ocean tide cycles"]',
'Climate systems amplifying or dampening changes',
'Climate feedback loops can either amplify (positive feedback) or dampen (negative feedback) the effects of climate change drivers.',
'hard', 10, 5),

(3, 'Which region is warming fastest due to climate change?', 'multiple_choice',
'["Tropical regions", "Temperate regions", "Arctic regions", "Desert regions"]',
'Arctic regions',
'The Arctic is warming at twice the global average rate due to ice-albedo feedback - as ice melts, darker surfaces absorb more heat.',
'medium', 10, 6),

(3, 'What is ocean acidification?', 'multiple_choice',
'["Oceans becoming more basic", "Oceans absorbing CO2 and becoming more acidic", "Salt concentration increasing", "Ocean temperatures rising"]',
'Oceans absorbing CO2 and becoming more acidic',
'Ocean acidification occurs when seawater absorbs CO2 from the atmosphere, forming carbonic acid and lowering ocean pH.',
'hard', 10, 7),

(3, 'Which climate phenomenon involves warming of Pacific Ocean waters?', 'multiple_choice',
'["La Niña", "El Niño", "Monsoon", "Hurricane"]',
'El Niño',
'El Niño is a climate pattern characterized by unusual warming of surface waters in the eastern tropical Pacific Ocean, affecting global weather.',
'medium', 10, 8),

(3, 'What is the main cause of sea level rise?', 'multiple_choice',
'["Thermal expansion of oceans and melting ice", "Underwater earthquakes", "Changes in ocean currents", "Increased rainfall"]',
'Thermal expansion of oceans and melting ice',
'Sea level rise is primarily caused by thermal expansion of warming oceans (about 50%) and melting of glaciers and ice sheets (about 50%).',
'medium', 10, 9),

(3, 'According to climate scientists, what global temperature increase should be limited to avoid catastrophic impacts?', 'multiple_choice',
'["1.0°C", "1.5°C", "2.0°C", "3.0°C"]',
'1.5°C',
'The IPCC and Paris Agreement emphasize limiting global warming to 1.5°C above pre-industrial levels to avoid the most severe climate impacts.',
'medium', 10, 10);

-- Quiz 4: Green Technology Innovation (Quiz ID: 4)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, difficulty, points, order_index) VALUES

(4, 'What is the most efficient type of solar panel currently available?', 'multiple_choice',
'["Monocrystalline silicon", "Polycrystalline silicon", "Thin-film", "Organic photovoltaic"]',
'Monocrystalline silicon',
'Monocrystalline silicon solar panels currently offer the highest efficiency rates, typically 15-24%, making them the most effective for space-limited applications.',
'medium', 10, 1),

(4, 'Which technology captures CO2 directly from the atmosphere?', 'multiple_choice',
'["Carbon capture and storage (CCS)", "Direct air capture (DAC)", "Biochar production", "Afforestation"]',
'Direct air capture (DAC)',
'Direct Air Capture technology uses chemical processes to capture CO2 directly from ambient air, which can then be stored or utilized.',
'hard', 10, 2),

(4, 'What is a smart grid?', 'multiple_choice',
'["A type of solar panel", "An electrical grid using digital technology", "A wind farm layout", "A water distribution system"]',
'An electrical grid using digital technology',
'Smart grids use digital communication technology to detect and react to local changes in usage, improving efficiency and reliability.',
'medium', 10, 3),

(4, 'Which green technology converts organic waste into energy?', 'multiple_choice',
'["Solar panels", "Wind turbines", "Biogas digesters", "Hydroelectric dams"]',
'Biogas digesters',
'Biogas digesters use anaerobic digestion to break down organic matter, producing methane that can be used for heating, electricity, or fuel.',
'medium', 10, 4),

(4, 'What is the main advantage of LED lighting over traditional incandescent bulbs?', 'multiple_choice',
'["Brighter light output", "Lower cost to purchase", "90% more energy efficient", "Available in more colors"]',
'90% more energy efficient',
'LED lights use about 90% less energy than incandescent bulbs and last 25 times longer, significantly reducing energy consumption and waste.',
'easy', 10, 5),

(4, 'Which technology is used to store energy from renewable sources?', 'multiple_choice',
'["Fossil fuel generators", "Battery storage systems", "Coal power plants", "Natural gas turbines"]',
'Battery storage systems',
'Battery storage systems, including lithium-ion and emerging technologies, store excess renewable energy for use when the sun isn t shining or wind isn t blowing.',
'easy', 10, 6),

(4, 'What is vertical farming?', 'multiple_choice',
'["Growing crops on mountainsides", "Growing crops in stacked layers indoors", "Growing only tall plants", "Traditional field farming"]',
'Growing crops in stacked layers indoors',
'Vertical farming uses controlled environment agriculture in vertically stacked layers, often using hydroponics and LED lighting for year-round production.',
'medium', 10, 7),

(4, 'Which green building certification system is most widely used globally?', 'multiple_choice',
'["BREEAM", "LEED", "Green Star", "CASBEE"]',
'LEED',
'LEED (Leadership in Energy and Environmental Design) is the most widely used green building rating system worldwide, promoting sustainable building practices.',
'medium', 10, 8),

(4, 'What is the circular economy?', 'multiple_choice',
'["A type of currency system", "An economic model based on reuse and recycling", "A stock market concept", "A farming technique"]',
'An economic model based on reuse and recycling',
'The circular economy is an economic model that eliminates waste through design, keeping products and materials in use for as long as possible.',
'hard', 10, 9),

(4, 'Which technology can convert plastic waste back into fuel?', 'multiple_choice',
'["Solar panels", "Wind turbines", "Pyrolysis", "Hydropower"]',
'Pyrolysis',
'Pyrolysis technology uses high temperatures in the absence of oxygen to break down plastic waste into fuel products like diesel and gasoline.',
'hard', 10, 10);
