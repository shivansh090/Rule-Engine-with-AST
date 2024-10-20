import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface Rule {
  _id: string;
  name: string;
  ast: string;
  str: string;
}

export default function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [ruleString, setRuleString] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [userData, setUserData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: '',
  });
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${API_URL}/rules`);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleCreateRule = async () => {
    try {
      await axios.post(`${API_URL}/rules`, {
        name: ruleName,
        ast: ruleString,
      });
      alert('Rule created successfully');
      setRuleString('');
      setRuleName('');
      fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Error creating rule');
    }
  };

  const handleEvaluate = async () => {
    try {
      const response = await axios.post(`${API_URL}/evaluate`, userData);
      setResult(response.data.eligible);
    } catch (error) {
      console.error('Error evaluating rules:', error);
      alert('Error evaluating rules');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Rule Engine</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create Rule</h2>
            <input
              className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Enter rule name"
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={ruleString}
              onChange={(e) => setRuleString(e.target.value)}
              placeholder="Enter rule string"
              rows={4}
            />
            <button
              className="w-full mt-2 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-200"
              onClick={handleCreateRule}
            >
              Create Rule
            </button>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Existing Rules</h2>
            <ul className="space-y-4">
              {rules.map((rule) => (
                <li key={rule._id} className="bg-gray-50 p-4 rounded-md shadow">
                  <h3 className="text-xl font-semibold text-gray-800">{rule.name}</h3>
                  <p className="mt-2 text-gray-600"><span className="font-medium">Rule:</span> {rule.str}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Evaluate Rules</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                type="number"
                placeholder="Age"
                value={userData.age}
                onChange={(e) => setUserData({ ...userData, age: e.target.value })}
              />
              <input
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                type="text"
                placeholder="Department"
                value={userData.department}
                onChange={(e) => setUserData({ ...userData, department: e.target.value })}
              />
              <input
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                type="number"
                placeholder="Salary"
                value={userData.salary}
                onChange={(e) => setUserData({ ...userData, salary: e.target.value })}
              />
              <input
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                type="number"
                placeholder="Experience"
                value={userData.experience}
                onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
              />
            </div>
            <button
              className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
              onClick={handleEvaluate}
            >
              Evaluate
            </button>
          </div>
          
          {result !== null && (
            <div className="mt-8 p-4 bg-gray-50 rounded-md shadow">
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">Result</h2>
              <p className={`text-lg ${result ? 'text-green-600' : 'text-red-600'}`}>
                User is <span className="font-bold">{result ? 'eligible' : 'not eligible'}</span> based on the rules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}