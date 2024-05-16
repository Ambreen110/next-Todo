import { connect } from '@/app/dbConfig/db';
import Todo from '@/app/models/todo';
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

type Todo = {
  user: string; 
  task: string;
  completed: boolean;
};
export default async function handler(NextResponse:NextResponse,req: NextApiRequest, res: NextApiResponse<Todo | any>) {
  const { userId, todoId } = req.query;

  await connect();

  switch (req.method) {
    case 'POST':
      try {
        if (!userId || !req.body.task) {
          return NextResponse.json();
        }

        const newTodo = new Todo({
          user: userId,
          task: req.body.task,
          completed: false,
        });

        await newTodo.save();
        res.status(200).json(newTodo);
      } catch (error) {
        return NextResponse.json();
      }
      break;


    case 'GET':
      try {
        if (!userId || !todoId) {
          return NextResponse.json();
        }

        const newTodo = await Todo.findOne({ _id: todoId, user: userId });
        if (!newTodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(newTodo);
      } catch (error) {
        return NextResponse.json();
      }
      break;

    case 'PUT':
      try {
        if (!userId || !todoId || !req.body) {
          return res.status(400).json({ message: 'Missing user ID, todo ID, or update data' });
        }

        const updatedTodo = await Todo.findOneAndUpdate(
          { _id: todoId, user: userId },
          req.body,
          { new: true } 
        );
        if (!updatedTodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting todos' });
      }
      break;

    case 'DELETE':
      try {
        if (!userId || !todoId) {
          return res.status(400).json({ message: 'Missing user ID or todo ID' });
        }

        const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
        if (!deletedTodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting todos' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
